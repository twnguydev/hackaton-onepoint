import ia4SudLogo from '@/assets/logo-ia4sud.svg';
import { X } from 'lucide-react';
// import './header.css';
 
 
import { useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
 
export default function Header() {
 
    const [isOpen, setIsOpen] = useState(false)
    const toggleDrawer = () => {
        setIsOpen((prevState) => !prevState)
    }
    const isEventFinished = true;
 
 
    useEffect(() => {
        if (isOpen) {
            document.body.classList.toggle('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [isOpen])
 
 
    useEffect(() => {
        const handleScroll = () => {
            const nav = document.querySelector('nav');
            if (nav) {
                if (window.scrollY === 0) {
                    nav.style.background = 'transparent';
                    // remove shadow
                    nav.style.boxShadow = 'none';
                } else {
                    const scrollPercentage = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
                    const gradientColors = [
                        [188, 104, 142],  // #BC688E
                        [109, 67, 142],  // #rgb(109 67 142)
                        [214, 100, 93]    // #d6645d
                    ];
 
                    const interpolatedColor = gradientColors.reduce((acc, color, index) => {
                        if (index === gradientColors.length - 1) return acc;
                        const nextColor = gradientColors[index + 1];
                        const segmentPercentage = Math.min(Math.max((scrollPercentage - index / (gradientColors.length - 1)) * (gradientColors.length - 1), 0), 1);
                        const r = Math.round(color[0] + (nextColor[0] - color[0]) * segmentPercentage);
                        const g = Math.round(color[1] + (nextColor[1] - color[1]) * segmentPercentage);
                        const b = Math.round(color[2] + (nextColor[2] - color[2]) * segmentPercentage);
                        return `rgb(${r}, ${g}, ${b})`;
                    }, '');
 
                    nav.style.background = interpolatedColor;
                    nav.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)';
                }
                nav.style.transition = 'background 0.3s ease-out';
                // add shadow
            }
        };
 
        window.addEventListener('scroll', handleScroll);
 
        // Nettoyage de l'écouteur d'événement lors du démontage du composant
        return () => {
            window.removeEventListener('scroll', handleScroll);
 
        };
    }, []);
 
    const menuItems = [
        {
            id: 1,
            label: 'Accueil',
            href: 'https://ia4sud.fr/'
        },
        {
            id: 2,
            label: 'Les vainqueurs du Hackathon',
            href: 'https://ia4sud.fr/#winners'
        },
        {
            id: isEventFinished ? 3 : 2,
            label: 'Les sujets abordés',
            href: 'https://ia4sud.fr/#subjects'
        },
        {
            id: isEventFinished ? 4 : 3,
            label: 'Réalisations',
            href: 'https://ia4sud.fr/#teams'
        },
        {
            id: isEventFinished ? 5 : 4,
            label: 'À propos',
            href: 'https://ia4sud.fr/#about'
        }
 
    ]
 
    const menuItemsWithoutWinners = menuItems.filter((item) => item.label !== 'Les vainqueurs du Hackathon')
    // return (
    //     <nav className='container-header flex justify-between w-full'>
    //         <a href='https://ia4sud.fr/' className='cursor-pointer w-1/7 logo-header '>
    //         <img src={ia4SudLogo} alt="code4sud logo" className='w-full self-start ' />
    //         </a>
    //         <div>
    //             <button onClick={toggleDrawer} className='cursor-pointer bg-transparent w-fit h-full flex items-center justify-end  menu-burger'>
    //                 <img src={burgerIcon} alt="menu burger" className='w-[32px] ' />
    //             </button>
    //             <Drawer
    //                 open={isOpen}
    //                 onClose={toggleDrawer}
    //                 direction='right'
    //                 className='!w-full h-screen !bg-[#d6645d] border border-[#d6645d] content-sheet'
    //             >
    //                 <button className='absolute top-4 z-50  bg-[#d6645d] right-5' onClick={toggleDrawer}>
    //                     <X className='text-white' size={40} />
    //                 </button>
    //                 <div className='text-white flex justify-center items-center h-screen'>
    //                     <ul className='flex flex-col gap-10'>
    //                         {isEventFinished ? (
    //                             menuItems.map((item) => (
    //                                 <li key={item.id}><a href={item.href} className='text-4xl  font-[Handjet,sans-serif] flex items-start gap-2' onClick={toggleDrawer}><span className='font-[Manrope] text-xl'>{item.id} </span>{item.label}</a></li>
    //                             ))
    //                         ) : (
    //                             menuItemsWithoutWinners.map((item) => (
    //                                 <li key={item.id}><a href={item.href} className='text-4xl  font-[Handjet,sans-serif] flex items-start gap-2' onClick={toggleDrawer}><span className='font-[Manrope] text-xl'>{item.id} </span>{item.label}</a></li>
    //                             ))
    //                         )}
    //                     </ul>
    //                 </div>
    //             </Drawer>
    //         </div>
    //     </nav>
    // )
 
    return (
        <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
            <div className=''>
 
 
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <a href="https://ia4sud.fr/"
                        className="cursor-pointer transform hover:scale-105 transition-transform duration-300">
                        <img src={ia4SudLogo} alt="ia4sud logo" className="h-12 w-auto" />
                    </a>
 
                    <button
                        onClick={toggleDrawer}
                        className="group flex flex-col gap-1.5 p-2 hover:bg-gray-800 rounded-lg transition-colors duration-300"
                    >
                        <span className="w-6 h-0.5 bg-white transform transition-all duration-300 group-hover:rotate-45 group-hover:translate-y-2"></span>
                        <span className="w-6 h-0.5 bg-white transition-all duration-300 group-hover:opacity-0"></span>
                        <span className="w-6 h-0.5 bg-white transform transition-all duration-300 group-hover:-rotate-45 group-hover:-translate-y-2"></span>
                    </button>
                </div>
                <Drawer
                    open={isOpen}
                    onClose={toggleDrawer}
                    direction="right"
                    className="!w-full sm:!w-96 !bg-gray-900 !border-l !border-gray-800"
                >
                    <div className="relative h-full p-6">
                        <button
                            className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-full transition-colors duration-300"
                            onClick={toggleDrawer}
                        >
                            <X className="text-white w-8 h-8" />
                        </button>
 
                        <div className="h-full flex items-center justify-center">
                            <ul className="space-y-6">
                                {(isEventFinished ? menuItems : menuItemsWithoutWinners).map((item) => (
                                    <li key={item.id} className="transform hover:translate-x-2 transition-transform duration-300">
                                        <a
                                            href={item.href}
                                            onClick={toggleDrawer}
                                            className="group flex items-start gap-4 text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            <span className="font-mono text-sm opacity-50 pt-1">{item.id}</span>
                                            <span className="text-3xl font-bold tracking-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-teal-400">
                                                {item.label}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Drawer>
            </div>
        </nav>
    );
}