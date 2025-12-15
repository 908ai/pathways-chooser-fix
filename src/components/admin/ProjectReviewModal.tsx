import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const formSchema = z.object({
  notes: z.string().optional(),
})

interface ProjectReviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (notes?: string) => void
  action: 'Approved' | 'Rejected' | null
}

export function ProjectReviewModal({
  isOpen,
  onClose,
  onSubmit,
  action,
}: ProjectReviewModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.notes)
    form.reset()
  }

  if (!action) return null

  const title = action === 'Approved' ? 'Approve Project' : 'Reject Project'
  const buttonText = action === 'Approved' ? 'Approve' : 'Reject'
  const buttonVariant = action === 'Approved' ? 'default' : 'destructive'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Add any notes for the ${action === 'Approved' ? 'approval' : 'rejection'}...`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant={buttonVariant}>
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}