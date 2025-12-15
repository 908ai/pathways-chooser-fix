import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import BuildingOfficialContact from '@/components/BuildingOfficialContact';

const BuildingOfficials = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-background">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">For Building Officials</h1>
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <p>This tool is designed to streamline the review process for energy compliance with Section 9.36 of the National Building Code. It provides clear, standardized reporting for all compliance paths.</p>
                            <p>As a building official, you can use this platform to:</p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Quickly verify project compliance against prescriptive, tiered, or performance path requirements.</li>
                                <li>View detailed project summaries and calculations in a consistent format.</li>
                                <li>Access uploaded documentation and energy models associated with a project.</li>
                            </ul>
                            <p>For questions or to get access for your municipality, please contact us.</p>
                            <BuildingOfficialContact />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BuildingOfficials;