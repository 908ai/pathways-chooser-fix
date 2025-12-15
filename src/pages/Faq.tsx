import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';

const faqData = [
    {
        question: "What is the purpose of this tool?",
        answer: "This tool is designed to help builders, designers, and energy advisors navigate the energy efficiency requirements of the National Building Code of Canada (NBC) 2020, specifically Section 9.36."
    },
    {
        question: "Which compliance paths are supported?",
        answer: "The tool supports the Prescriptive, Tiered, and Performance compliance paths outlined in Section 9.36."
    },
    {
        question: "Is this tool a substitute for an official energy model?",
        answer: "No. While the tool provides accurate calculations based on the NBC, it is not a substitute for a certified energy model created by a qualified energy advisor, especially for the Performance path."
    },
    {
        question: "How do I save my project?",
        answer: "You can save your project at any time by clicking the 'Save Project' button. You will need to be logged in to save your progress."
    }
];

const Faq = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-gray-50 dark:bg-background">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                    <Card>
                        <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                                {faqData.map((item, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>{item.question}</AccordionTrigger>
                                        <AccordionContent>{item.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Faq;