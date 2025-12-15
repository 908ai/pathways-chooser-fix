import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Link as LinkIcon } from 'lucide-react';

const resources = [
    {
        title: "NBC 2020 Section 9.36",
        description: "Official documentation for the energy efficiency requirements.",
        type: "link",
        url: "https://nrc.canada.ca/en/certifications-evaluations-standards/codes-canada/codes-canada-publications/national-building-code-canada-2020"
    },
    {
        title: "Trade-off Path Calculator",
        description: "An Excel-based tool for exploring trade-off options.",
        type: "file",
        url: "/reference/calgary-trade-off-calculator.xlsm"
    },
    {
        title: "Guide to Energy Efficiency",
        description: "A comprehensive guide to understanding and applying Section 9.36.",
        type: "link",
        url: "#"
    }
];

const Resources = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-background">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Resources</h1>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {resources.map((resource, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        {resource.type === 'file' ? <FileText className="mr-2" /> : <LinkIcon className="mr-2" />}
                                        {resource.title}
                                    </CardTitle>
                                    <CardDescription>{resource.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {resource.type === 'file' ? 'Download File' : 'Visit Link'}
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Resources;