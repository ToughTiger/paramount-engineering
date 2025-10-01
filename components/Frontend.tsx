import React from 'react';
import { useAppContext } from '../AppContext';
import { Logo } from './Logo';
import { InstagramIcon, PinterestIcon, FacebookIcon, LinkedinIcon, TwitterIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { AnimatedSection } from './AnimatedSection';
import { BlogPost, PortfolioItem } from '../types';

// Dummy implementation for a router link to avoid dependency on a router library
const RouterLink = ({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) => (
    <a href={to} className={className}>{children}</a>
);


const Header = () => (
    <header className="absolute top-0 left-0 right-0 z-20 py-6 px-4 sm:px-8 bg-gradient-to-b from-black/50 to-transparent">
        <div className="container mx-auto flex justify-between items-center">
            <Logo variant="light" />
            <nav className="hidden md:flex space-x-8">
                <RouterLink to="#home" className="text-white hover:text-lime-300 transition-colors">Home</RouterLink>
                <RouterLink to="#portfolio" className="text-white hover:text-lime-300 transition-colors">Portfolio</RouterLink>
                <RouterLink to="#about" className="text-white hover:text-lime-300 transition-colors">About</RouterLink>
                <RouterLink to="#blog" className="text-white hover:text-lime-300 transition-colors">Blog</RouterLink>
                <RouterLink to="#contact" className="text-white hover:text-lime-300 transition-colors">Contact</RouterLink>
            </nav>
        </div>
    </header>
);

const HeroSlider = () => {
    const { heroSlides } = useAppContext();
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const nextSlide = React.useCallback(() => setCurrentIndex(prev => (prev + 1) % heroSlides.length), [heroSlides.length]);
    
    React.useEffect(() => {
        if (heroSlides.length > 1) {
            const timer = setTimeout(nextSlide, 7000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, heroSlides.length, nextSlide]);

    const prevSlide = () => setCurrentIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length);

    if (!heroSlides || heroSlides.length === 0) return null;

    return (
        <section id="home" className="relative h-screen w-full overflow-hidden text-white">
            {heroSlides.map((slide, index) => (
                <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
            ))}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">{heroSlides[currentIndex].title}</h1>
                <p className="text-xl md:text-2xl max-w-3xl">{heroSlides[currentIndex].subtitle}</p>
            </div>
            {heroSlides.length > 1 && <>
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40"><ChevronLeftIcon /></button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40"><ChevronRightIcon /></button>
            </>}
        </section>
    );
};


const PortfolioSection = () => {
    const { portfolioItems, categories } = useAppContext();
    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'Uncategorized';
    
    return (
        <section id="portfolio" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center mb-4">Our Work</h2>
                    <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-12">We transform visions into reality. Explore a selection of our finest projects.</p>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioItems.map((item: PortfolioItem) => (
                        <AnimatedSection key={item.id}>
                            <div className="group relative overflow-hidden rounded-lg shadow-lg">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h3 className="text-2xl font-bold text-white text-center">{item.title}</h3>
                                    <p className="text-lime-300 font-semibold">{getCategoryName(item.category)}</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AboutSection = () => {
    const { aboutContent } = useAppContext();
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                <AnimatedSection>
                    <img src={aboutContent.imageUrl} alt="Our Team" className="rounded-lg shadow-xl w-full" />
                </AnimatedSection>
                <AnimatedSection>
                    <h2 className="text-4xl font-bold mb-4">About Us</h2>
                    <h3 className="text-2xl font-semibold text-lime-500 mb-4">Our Mission</h3>
                    <p className="text-slate-600 mb-6">{aboutContent.mission}</p>
                    <h3 className="text-2xl font-semibold text-lime-500 mb-4">Our Story</h3>
                    <p className="text-slate-600">{aboutContent.bio}</p>
                </AnimatedSection>
            </div>
        </section>
    );
};

const BlogSection = () => {
    const { blogPosts, categories } = useAppContext();
    const getCategoryName = (id: number) => categories.find(c => c.id === id)?.name || 'Uncategorized';
    
    return (
        <section id="blog" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center mb-4">From Our Blog</h2>
                    <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-12">Insights, trends, and inspiration from the world of interior design.</p>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {blogPosts.slice(0, 2).map((post: BlogPost) => (
                        <AnimatedSection key={post.id}>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover"/>
                                <div className="p-6">
                                    <p className="text-sm text-lime-600 font-semibold">{getCategoryName(post.category)}</p>
                                    <h3 className="text-2xl font-bold my-2">{post.title}</h3>
                                    <p className="text-slate-600 mb-4 line-clamp-3">{post.content}</p>
                                    <RouterLink to={`/blog/${post.slug}`} className="font-semibold text-indigo-600 hover:text-indigo-800">Read More &rarr;</RouterLink>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ContactSection = () => (
    <section id="contact" className="py-20 bg-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
                <h2 className="text-4xl font-bold mb-4">Let's Create Together</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">Have a project in mind? We'd love to hear from you. Get in touch to schedule a consultation.</p>
                <button className="bg-lime-400 text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-lime-300 transition-colors">Contact Us</button>
            </AnimatedSection>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <Logo variant="light" />
                <p className="text-sm mt-2">&copy; {new Date().getFullYear()} PARAMOUNT Engineering. All Rights Reserved.</p>
            </div>
            <div className="flex space-x-4">
                <a href="#" className="hover:text-white"><TwitterIcon /></a>
                <a href="#" className="hover:text-white"><FacebookIcon /></a>
                <a href="#" className="hover:text-white"><InstagramIcon /></a>
                <a href="#" className="hover:text-white"><PinterestIcon /></a>
                <a href="#" className="hover:text-white"><LinkedinIcon /></a>
            </div>
        </div>
    </footer>
);

const Frontend = () => {
    return (
        <main>
            <Header />
            <HeroSlider />
            <PortfolioSection />
            <AboutSection />
            <BlogSection />
            <ContactSection />
            <Footer />
        </main>
    );
};

export default Frontend;
