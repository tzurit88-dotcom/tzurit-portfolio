import { Project } from './types';

// Import MindEd images
import mindedHero from './assets/images/regenerated_image_1779030218289.png';
import mindedCardTop from './assets/images/minded_card_top.png';
import mindedCardBottom from './assets/images/minded_card_bottom.png';
import mindedLighterAttempt from './assets/images/regenerated_image_1779030201156.png';
import mindedComparison from './assets/images/regenerated_image_1779030226816.png';
import mindedFinal from './assets/images/regenerated_image_1779030236334.png';

// Import GUS images
import gusDesktop from './assets/images/gus_desktop.png';
import gusMobile from './assets/images/gus_mobile.png';
import gusHeroNew from './assets/images/gus_hero_new.png';
import gusRevision from './assets/images/gus_revision.png';
import gusModal from './assets/images/gus_modal.png';
import gusChat from './assets/images/gus_chat.png';
import gusFeedback from './assets/images/gus_feedback.png';
import gusMobileView from './assets/images/gus_mobile_view.png';
import gusProtoScreen2 from './assets/images/gus_proto_screen_2.png';
import gusProtoScreen3 from './assets/images/gus_proto_screen_3.png';
import gusMobileLesson from './assets/images/gus_mobile_lesson.png';
import gusMobileDrawer from './assets/images/gus_mobile_drawer.png';
import gusMobileEngagement from './assets/images/gus_mobile_engagement.png';

// Import PressPective images
import perspectiveHero from './assets/images/perspective_hero.png';
import perspectiveCardTop from './assets/images/perspective_card_top.png';
import perspectiveCardBottom from './assets/images/perspective_card_bottom.png';
import perspectiveJournalistic from './assets/images/regenerated_image_1779187158616.png';
import perspectiveSolution2 from './assets/images/perspective_solution_2.png';
import perspectiveInterview from './assets/images/regenerated_image_1779187363818.png';
import perspectiveRating from './assets/images/regenerated_image_1779187388770.png';
import perspectiveTeacher from './assets/images/regenerated_image_1779187392577.png';

// Import Myzon uploaded image
import myzonDashboard from './assets/images/regenerated_image_1779705208214.png';
import myzonDashboard2 from './assets/images/regenerated_image_1779705338387.png';
import myzonAnalytics from './assets/images/regenerated_image_1779741713949.png';
import myzonMainMockup from './assets/images/myzon_main_mockup.png';
import myzonCampaignManager from './assets/images/myzon_campaign_manager.png';
import myzonContentGeneration from './assets/images/myzon_content_generation.png';
import myzonMarketIntelligence from './assets/images/myzon_market_intelligence.png';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'MindEd',
    category: 'Product Design, EdTech',
    description: 'Redesigning the development area of a vibe coding platform for educators.',
    fullDescription: 'MindEd is a specialized platform designed to empower educators with modern coding tools. This project focused on redesigning the core development area to lower the barrier to entry while maintaining professional-grade functionality. The redesign emphasized clarity, flow, and "vibe coding" principles to make the technical process feel more intuitive and creative.',
    imageUrl: mindedHero,
    thumbnailImages: [
      mindedCardTop,
      mindedCardBottom
    ],
    galleryImages: [
      mindedHero,              // 0: Unique hero
      mindedCardTop,           // 1: Before redesign
      mindedCardBottom,        // 2: After redesign
      mindedLighterAttempt,    // 3: Lighter attempt
      mindedComparison,        // 4: Before vs After comparison
      mindedFinal              // 5: Final redesign
    ],
    gifUrl: 'https://media.giphy.com/media/3o7TKMGpxP5O397N5e/giphy.gif', // Placeholder for the Before/After comparison
    year: '2024',
    role: 'Lead Product Designer',
    tags: ['EdTech', 'UX Redesign', 'System Thinking'],
  },
  {
    id: '2',
    title: 'GUS',
    category: 'AI, Higher Education',
    description: 'Designing an AI-powered, adaptive learning experience for higher education',
    fullDescription: 'GUS is a comprehensive educational ecosystem built for Global University Systems. This project involved designing a seamless, AI-driven adaptive learning experience that caters to both students (through a high-engagement mobile app) and educators (via a powerful data-driven dashboard). The system uses machine learning to personalize learning paths, providing real-time feedback and behavioral insights.',
    imageUrl: gusDesktop,
    thumbnailImages: [gusMobile, gusDesktop],
    galleryImages: [
      gusHeroNew,      // 0: Unique Hero (To be uploaded)
      gusRevision,      // 1: Revision Control
      gusModal,         // 2: Modal
      gusChat,          // 3: Chat Sidebar
      gusFeedback,      // 4: Mobile Interface
      gusMobileView,   // 5: Proto Screen 1
      gusProtoScreen2,// 6: Proto Screen 2 (To be uploaded)
      gusProtoScreen3, // 7: Proto Screen 3 (To be uploaded)
      gusMobileLesson,      // 8: New Mobile Adaptability 1
      gusMobileDrawer,      // 9: New Mobile Adaptability 2
      gusMobileEngagement,  // 10: New Mobile Adaptability 3
    ],
    year: '2024',
    role: 'Product Designer',
    tags: ['AI', 'Adaptive Learning', 'Higher Ed'],
  },
  {
    id: '3',
    title: 'PressPective',
    category: 'Educational Tool, UX Design',
    description: 'Designing and leading an experiential learning tool for middle school history classes',
    fullDescription: 'PressPective is an innovative experiential learning tool designed specifically for middle school history education. The project focuses on creating immersive historical simulations that help students understand complex perspectives and historical contexts through active participation and digital storytelling.',
    imageUrl: perspectiveCardTop,
    thumbnailImages: [
      perspectiveCardTop,
      perspectiveCardBottom
    ],
    galleryImages: [
      perspectiveHero,            // 0: Hero
      perspectiveJournalistic, // 1: Journalistic Metaphor
      perspectiveSolution2,      // 2: Question Notepad
      perspectiveInterview, // 3: Interview Room
      perspectiveRating, // 4: Rating Meter
      perspectiveTeacher  // 5: Teacher Panel
    ],
    gifUrl: '/src/assets/images/perspective_solution_1.gif',
    videoUrl: '/src/assets/images/perspective_solution_1.mp4',
    year: '2024',
    role: 'Sole Product Designer',
    tags: ['EdTech', 'History', 'UX UI'],
  },
  {
    id: '4',
    title: 'Myzon',
    category: 'AI, Product Design',
    description: 'Designing an AI-powered platform for Amazon sellers to generate smart marketing materials.',
    fullDescription: 'Myzon is an intelligent platform designed to streamline and automate marketing asset generation for Amazon sellers. The solution leverages generative AI workflows and structured systems thinking to produce cohesive, high-conversion visual and written brand materials designed specifically to meet Amazon marketplace standards.',
    imageUrl: myzonMainMockup,
    thumbnailImages: [
      myzonMainMockup,
      myzonMainMockup
    ],
    galleryImages: [
      myzonDashboard2,             // 0: System Overview
      myzonAnalytics,              // 1: Performance Analytics
      myzonCampaignManager,        // 2: Campaign Manager
      myzonContentGeneration,      // 3: Content Generation
      myzonMarketIntelligence      // 4: Market Intelligence
    ],
    year: '2023',
    role: 'Sole Product Designer',
    tags: ['AI', 'E-commerce', 'Product Design'],
  },
];
