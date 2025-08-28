import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Subfolders to create for each project
const PROJECT_SUBFOLDERS = [
  'Building Plans',
  'HVAC Specs', 
  'Window Schedule',
  'Other Documents'
]

interface RequestBody {
  project_id: string
  project_name: string
  user_id: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const body: RequestBody = await req.json()
    const { project_id, project_name, user_id } = body

    console.log('Creating enhanced Dropbox folder structure for project:', { project_id, project_name, user_id })

    // Get Dropbox access token from Supabase secrets
    const dropboxToken = Deno.env.get('DROPBOX_ACCESS_TOKEN')
    if (!dropboxToken) {
      console.log('Dropbox access token not configured - using placeholder mode')
      
      // Placeholder mode: just log what would happen
      const sanitizedProjectName = project_name.replace(/[<>:"/\\|?*]/g, '_').trim()
      const folderPath = `/Lovable Projects/${sanitizedProjectName}`
      
      console.log(`Would create Dropbox folder: ${folderPath}`)
      console.log(`Would create subfolders: ${PROJECT_SUBFOLDERS.join(', ')}`)
      
      // Still update the project record with placeholder info
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      await supabase
        .from('project_summaries')
        .update({ 
          energy_insights: { 
            dropbox_folder_path: folderPath,
            dropbox_status: 'placeholder_mode',
            subfolders: PROJECT_SUBFOLDERS
          }
        })
        .eq('id', project_id)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Placeholder mode - Dropbox token not configured',
          folder_path: folderPath,
          status: 'placeholder',
          subfolders: PROJECT_SUBFOLDERS
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create main folder name - sanitize project name for folder naming
    const sanitizedProjectName = project_name.replace(/[<>:"/\\|?*]/g, '_').trim()
    const mainFolderPath = `/Lovable Projects/${sanitizedProjectName}`

    console.log('Creating main folder at path:', mainFolderPath)

    // Create main project folder in Dropbox
    const mainFolderResponse = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dropboxToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: mainFolderPath,
        autorename: true
      })
    })

    const mainFolderResult = await mainFolderResponse.json()

    if (!mainFolderResponse.ok) {
      console.error('Dropbox API error creating main folder:', mainFolderResult)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create main Dropbox folder', 
          details: mainFolderResult 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Main Dropbox folder created successfully:', mainFolderResult)

    // Create subfolders
    const createdFolders = []
    const actualFolderPath = mainFolderResult.metadata.path_display

    for (const subfolder of PROJECT_SUBFOLDERS) {
      const subfolderPath = `${actualFolderPath}/${subfolder}`
      
      try {
        const subfolderResponse = await fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${dropboxToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: subfolderPath,
            autorename: false
          })
        })

        const subfolderResult = await subfolderResponse.json()
        
        if (subfolderResponse.ok) {
          console.log(`Subfolder created: ${subfolder}`)
          createdFolders.push({
            name: subfolder,
            path: subfolderResult.metadata.path_display,
            id: subfolderResult.metadata.id
          })
        } else {
          console.error(`Failed to create subfolder ${subfolder}:`, subfolderResult)
        }
      } catch (error) {
        console.error(`Error creating subfolder ${subfolder}:`, error)
      }
    }

    // Create file request links for each subfolder
    const fileRequestLinks = []
    
    for (const folder of createdFolders) {
      try {
        const fileRequestResponse = await fetch('https://api.dropboxapi.com/2/file_requests/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${dropboxToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `Upload files to ${folder.name} - ${project_name}`,
            destination: folder.path,
            deadline: {
              deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
              allow_late_uploads: 'seven_days'
            },
            open: true
          })
        })

        const fileRequestResult = await fileRequestResponse.json()
        
        if (fileRequestResponse.ok) {
          console.log(`File request created for ${folder.name}:`, fileRequestResult.url)
          fileRequestLinks.push({
            folder_name: folder.name,
            folder_path: folder.path,
            file_request_url: fileRequestResult.url,
            file_request_id: fileRequestResult.id
          })
        } else {
          console.error(`Failed to create file request for ${folder.name}:`, fileRequestResult)
        }
      } catch (error) {
        console.error(`Error creating file request for ${folder.name}:`, error)
      }
    }

    // Store everything in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Update project record with Dropbox folder info
    const { error: updateError } = await supabase
      .from('project_summaries')
      .update({ 
        energy_insights: { 
          dropbox_folder_path: actualFolderPath,
          dropbox_folder_id: mainFolderResult.metadata.id,
          dropbox_status: 'active',
          subfolders: createdFolders,
          file_request_count: fileRequestLinks.length
        }
      })
      .eq('id', project_id)

    if (updateError) {
      console.error('Error updating project with Dropbox info:', updateError)
    }

    // Store file request links in file_requests table
    if (fileRequestLinks.length > 0) {
      const fileRequestRows = fileRequestLinks.map(link => ({
        project_id,
        folder_name: link.folder_name,
        file_request_url: link.file_request_url,
        folder_path: link.folder_path
      }))

      const { error: insertError } = await supabase
        .from('file_requests')
        .insert(fileRequestRows)

      if (insertError) {
        console.error('Error storing file request links:', insertError)
      } else {
        console.log(`Stored ${fileRequestLinks.length} file request links in database`)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        main_folder_path: actualFolderPath,
        main_folder_id: mainFolderResult.metadata.id,
        subfolders_created: createdFolders.length,
        file_requests_created: fileRequestLinks.length,
        file_request_links: fileRequestLinks
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in create-dropbox-folder function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})