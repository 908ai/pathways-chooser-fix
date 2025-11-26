import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Clock, ExternalLink, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const resources = {
  alberta: [
    {
      title: 'Building codes and standards',
      description: 'Building codes, standards, guidelines, forms and STANDATA.',
      url: 'https://www.alberta.ca/building-codes-and-standards'
    },
    {
      title: 'BILD Alberta',
      description: 'As part of an initiative to educate industry on the 2023 National Building Code- Alberta Edition, a six-part on-demand video series was developed to support industry in increasing their knowledge and understanding.',
      url: 'https://bildalberta.ca/video-resources/'
    },
    {
      title: 'ENBIX',
      description: 'Emissions-Neutral Buildings Information Exchange (ENBIX) is an industry-led collaborative platform to share knowledge and support sustainable building and renovation practices across Alberta.',
      url: 'https://www.enbix.ca/'
    },
    {
      title: 'Alberta Safety Codes Council',
      description: 'A statutory corporation responsible for overseeing the safety codes system in the province. It accredits organizations, recommends new codes, and provides training and certification for safety codes officers.',
      url: 'https://www.safetycodes.ab.ca/'
    },
    {
      title: 'Passive House Alberta',
      description: 'Built for Alberta’s cold and ever-changing climate, Passive House certified buildings create a healthy, comfortable and sustainable homes and work environments for all Albertans.',
      url: 'https://passivehousealberta.com'
    },
    {
      title: 'SSRIA',
      description: 'A not for profit member organization that fosters collaboration to accelerate the adoption of innovative low-carbon solutions for the built environment, focusing on the Architecture, Engineering, and Construction (AEC) industry.',
      url: 'https://www.ssria.ca/'
    },
    {
      title: 'Alberta Energy Efficiency Alliance',
      description: 'A member-based organization with a diverse group of stakeholders actively working to maximize energy efficiency in the province of Alberta.',
      url: 'https://www.aeea.ca/'
    },
    {
      title: 'Alberta Building Officials Association',
      description: 'Dedicated to enhancing building safety and improving inspection standards across Alberta through educational resources, national certification, and a platform for industry discussion.',
      url: 'https://www.aboa.ab.ca/'
    },
    {
      title: 'Clean Energy Improvement Program',
      description: 'An Alberta Municipalities-administered program that provides financing for property owners to undertake energy efficiency and renewable energy upgrades, paid through their property tax bill.',
      url: 'https://ceip.abmunis.ca/'
    }
  ],
  national: [
    {
      title: 'LEEP - Local Energy Efficiency Partnerships',
      description: 'LEEP accelerates energy efficient construction by enabling builders to reduce their time and risk in finding and trying innovations that can help them build higher performance homes better, faster and more affordably.',
      url: 'https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/local-energy-efficiency-partnerships-leep'
    },
    {
      title: 'Passive House Canada',
      description: 'Advocates for the Passive House Institute and supportive standards to inform, train and support industry, governments, and owners with a whole-building approach that minimizes carbon footprints.',
      url: 'https://www.passivehousecanada.com/'
    },
    {
      title: 'Canadian Association of Certified Energy Advisors',
      description: 'Created to respond to changes to codes and standards, municipal requirements, and new regulations, providing a centralized point of contact for stakeholders relying on EAs for guidance.',
      url: 'https://cacea.ca/'
    },
    {
      title: 'SAIT Green Building Technology Access Centre',
      description: 'Collaborates to de-risk and deliver holistic high-performance building solutions that address environmental, social, and economic realities, while also developing training and support systems.',
      url: 'https://www.sait.ca/research-and-innovation-services/green-building-technologies'
    },
    {
      title: 'CHBA National',
      description: 'Seeks a strong and positive role for the housing industry in Canada’s economy and supports the business success of its members, ensuring Canadians have access to affordable homes.',
      url: 'https://www.chba.ca/'
    },
    {
      title: 'CHBA Net Zero Home Program',
      description: 'Net Zero Homes produce as much clean energy as they consume. They are far more energy efficient than typical new homes and greatly reduce your impact on the environment.',
      url: 'https://www.chba.ca/net-zero/'
    },
    {
      title: 'Built Green Canada',
      description: 'Industry-driven certification programs created to encourage and facilitate sustainable building practices, addressing eight key areas of sustainable building.',
      url: 'https://www.builtgreencanada.ca/'
    },
    {
      title: 'National Building Code of Canada 2020',
      description: 'The official publication of the national building code, setting standards for new construction and renovation across Canada.',
      url: 'https://nrc.canada.ca/en/certifications-evaluations-standards/codes-canada/codes-canada-publications/national-building-code-canada-2020'
    },
    {
      title: 'EnerGuide for Homes',
      description: 'A national program that provides a rating for a home\'s energy performance. An official evaluation by a certified energy advisor is required to get an EnerGuide label and report.',
      url: 'https://natural-resources.canada.ca/energy-efficiency/home-energy-efficiency/energuide-rated-new-homes'
    },
    {
      title: 'Canada Green Buildings Strategy',
      description: 'A strategy for transforming Canada’s buildings sector for a net-zero and resilient future.',
      url: 'https://natural-resources.canada.ca/energy-efficiency/building-energy-efficiency/canada-green-buildings-strategy-transforming-canada-s-buildings-sector-net-zero-resilient-future'
    },
    {
      title: 'Professional Home Builders Institute (PHBI)',
      description: 'Established by builders, for builders, PHBI designs and delivers practical education that meets or exceeds national benchmarks for the home construction industry.',
      url: 'https://www.phbi.ca/ab/'
    },
    {
      title: 'Blue House Energy',
      description: 'Provides online training resources to companies, managers and employees in the residential energy efficiency field with an easy-to-use, on-demand platform.',
      url: 'https://bluehouseenergy.com/'
    },
    {
      title: 'Canadian Institute for Energy Training (CIET)',
      description: 'Equips professionals and organizations with the tools to make meaningful change in energy and decarbonization education.',
      url: 'https://cietcanada.com/'
    },
    {
      title: 'Sustainable Buildings Canada',
      description: 'A not-for-profit leader in advancing sustainability, enabling designers, developers, builders, and operators to achieve high-performance outcomes.',
      url: 'https://sbcanada.org/'
    },
    {
      title: 'Building Knowledge Canada',
      description: 'Supports builders with advanced building science education, services, and tools to deliver homes that Canadians love to live in.',
      url: 'https://www.buildingknowledge.ca/videos'
    },
    {
      title: 'Energy Efficiency Canada',
      description: 'The national voice for an energy efficient economy, driving economic growth, stable jobs, and healthier homes through sound policy-making.',
      url: 'https://www.efficiencycanada.org/'
    },
    {
      title: 'Canada Green Building Council',
      description: 'Supports the building sector’s transition to green buildings, providing market insights, expertise, and practical solutions to push sustainability efforts further and faster.',
      url: 'https://www.cagbc.org/'
    },
    {
      title: 'Green Building Canada',
      description: 'A network connecting sustainability-focused professionals, suppliers, manufacturers, and homeowners to promote green building and reduce environmental impact.',
      url: 'https://greenbuildingcanada.ca'
    },
    {
      title: 'Retrofit Canada',
      description: 'An open-source project to help retrofit every building in Canada by 2050, aiming to start a movement to make existing homes net zero.',
      url: 'https://retrofitcanada.com/'
    },
    {
      title: 'Pembina Institute',
      description: 'A Canadian think tank that provides research, analysis, and policy recommendations to promote the transition to a clean energy economy.',
      url: 'https://www.pembina.org/programs/buildings'
    }
  ],
  saskatchewan: [
    {
      title: 'Province of Saskatchewan - Building Codes',
      description: 'Saskatchewan adopts the NBC with few amendments, setting minimum standards for building, accessibility, and energy for houses and small buildings.',
      url: 'https://www.saskatchewan.ca/business/housing-development-construction-and-property-management/building-and-technical-standards/national-building-and-fire-code-information'
    },
    {
      title: 'Saskatchewan Building Officials Association',
      description: 'Building code professionals who provide enforcement and administrative services for governments related to building permits for new construction, additions, and renovations.',
      url: 'https://sboa.sk.ca/'
    },
    {
      title: 'SaskEnergy - Homes Beyond Code',
      description: 'An initiative to encourage the construction of new homes that are more energy-efficient than the minimum building code requires, offering rebates to builders and homeowners.',
      url: 'https://www.saskenergy.com/homes-beyond-code-program'
    },
    {
      title: 'Modular Housing Association Prairie Provinces',
      description: 'The regional trade association that has represented the interests of the modular and manufactured housing industry in Alberta, Saskatchewan, and Manitoba since 1976.',
      url: 'https://mhaprairies.ca/'
    },
    {
      title: 'Saskatoon Homebuilders’ Association',
      description: 'Fosters an environment in which members can operate successfully and promotes affordability, sustainability, and choice in housing for all citizens of Saskatoon and Region.',
      url: 'https://saskatoonhomebuilders.com/'
    },
    {
      title: 'Regina Home Builders’ Association',
      description: 'Members agree to uphold professional standards in the products and services they offer, ensuring quality and service for new homes and improvements.',
      url: 'https://reginahomebuilders.com/'
    }
  ]
};

const ResourceItem = ({ resource }: { resource: { title: string; description: string; url: string } }) => (
  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:shadow-md transition-all">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 flex-shrink-0 bg-slate-100 border border-slate-200 rounded-md flex items-center justify-center">
        <Image className="h-8 w-8 text-slate-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
          <span>{resource.title}</span>
          <ExternalLink className="h-4 w-4 text-slate-400" />
        </div>
        <p className="text-sm text-slate-600">{resource.description}</p>
      </div>
    </div>
  </a>
);

const ResourcesPage = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header showSignOut={true} onSignOut={signOut} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Resources</h1>
          <p className="text-slate-500 mt-1">
            Guides, timelines, and technical services for NBC 9.36 compliance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="bg-white shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Clock className="h-5 w-5 text-slate-500" />
                    File Processing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-800">Day 1-2</div>
                        <div className="text-sm text-blue-700">Project review & initial assessment</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-orange-800">Day 3-5</div>
                        <div className="text-sm text-orange-700">Initial modeling & recommendations</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-800">Upon Compliance</div>
                        <div className="text-sm text-green-700">Invoice → Payment → Report Release</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                      * Timelines reset if files are sent back for corrections.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900">Energy Code Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://solinvictusenergyservices.com/energy-hack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                      <span>Energy Code Hack</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-600">Learn which compliance pathway saves you the most money.</div>
                  </a>
                  <a
                    href="https://solinvictusenergyservices.com/airtightness"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                      <span>Airtightness Requirements</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-600">Regional requirements for air-tightness testing.</div>
                  </a>
                  <a
                    href="https://static1.squarespace.com/static/5659e586e4b0f60cdbb0acdb/t/6740da3ccee315629895c31b/1732303420707/Blower+Door+Checklist.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                      <span>Blower Door Checklist (PDF)</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-600">A complete checklist for blower door testing.</div>
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-slate-900">Technical Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://solinvictusenergyservices.com/cancsa-f28012"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium text-slate-800 mb-1">
                      <span>CAN/CSA F280-12 Heat Loss/Gain</span>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="text-sm text-slate-600">Room-by-room calculations for sizing HVAC systems.</div>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white shadow-sm rounded-lg">
              <CardHeader>
                <CardTitle className="text-slate-900">External Resources</CardTitle>
                <CardDescription className="text-slate-500">
                  A collection of useful links from industry organizations and government bodies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="alberta" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="alberta">Alberta</TabsTrigger>
                    <TabsTrigger value="national">National</TabsTrigger>
                    <TabsTrigger value="saskatchewan">Saskatchewan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="alberta" className="mt-4 space-y-4">
                    {resources.alberta.map(resource => <ResourceItem key={resource.title} resource={resource} />)}
                  </TabsContent>
                  <TabsContent value="national" className="mt-4 space-y-4">
                    {resources.national.map(resource => <ResourceItem key={resource.title} resource={resource} />)}
                  </TabsContent>
                  <TabsContent value="saskatchewan" className="mt-4 space-y-4">
                    {resources.saskatchewan.map(resource => <ResourceItem key={resource.title} resource={resource} />)}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;