import { Project } from './types';

// Import MindEd images
import mindedHero from './assets/images/regenerated_image_1779030218289.png';
import mindedCardTop from './assets/images/minded_card_top.png';
import mindedCardBottom from './assets/images/minded_card_bottom.png';
import mindedAfterGif from './assets/images/minded_after_redesign.gif';
import mindedBeforeGif from './assets/images/minded_before_redesign_new.gif';
import mindedLighterAttempt from './assets/images/regenerated_image_1779030201156.png';
import mindedComparison from './assets/images/regenerated_image_1779030226816.png';
import mindedFinal from './assets/images/regenerated_image_1779030236334.png';

// Import GUS Carousel images
import gusLecturer01 from './assets/images/gus_carousel/lecturer_01_new.png';
import gusLecturer02 from './assets/images/gus_carousel/lecturer_02.png';
import gusLecturer03 from './assets/images/gus_carousel/lecturer_03.png';
import gusLecturer04 from './assets/images/gus_carousel/lecturer_04.png';
import gusLecturer05 from './assets/images/gus_carousel/lecturer_05.png';
import gusLecturer06 from './assets/images/gus_carousel/lecturer_06.png';
import gusLecturer07 from './assets/images/gus_carousel/lecturer_07.png';
import gusLecturer08 from './assets/images/gus_carousel/lecturer_08.png';
import gusLecturer09 from './assets/images/gus_carousel/lecturer_09.png';
import gusLecturer10 from './assets/images/gus_carousel/lecturer_10.png';
import gusStudentDesktop01 from './assets/images/gus_carousel/student_desktop_01.png';
import gusStudentDesktop02 from './assets/images/gus_carousel/student_desktop_02.png';
import gusStudentDesktop03 from './assets/images/gus_carousel/student_desktop_03.png';
import gusStudentDesktop04 from './assets/images/gus_carousel/student_desktop_04.png';
import gusStudentDesktop05 from './assets/images/gus_carousel/student_desktop_05.png';
import gusStudentDesktop06 from './assets/images/gus_carousel/student_desktop_06.png';
import gusStudentMobile01 from './assets/images/gus_carousel/student_mobile_01_new.png';
import gusStudentMobile02 from './assets/images/gus_carousel/student_mobile_02_new.png';
import gusStudentMobile03 from './assets/images/gus_carousel/student_mobile_03.png';
import gusStudentMobile04 from './assets/images/gus_carousel/student_mobile_04.png';
import gusStudentMobile05 from './assets/images/gus_carousel/student_mobile_05_new.png';
import gusStudentMobile06 from './assets/images/gus_carousel/student_mobile_06.png';
import gusStudentMobile07 from './assets/images/gus_carousel/student_mobile_07.png';
import gusStudentMobile08 from './assets/images/gus_carousel/student_mobile_08.png';
import gusStudentMobile09 from './assets/images/gus_carousel/student_mobile_09.png';
import gusStudentMobile10 from './assets/images/gus_carousel/student_mobile_10.png';

// Import GUS images
import gusDesktop from './assets/images/gus_desktop.png';
import gusMobile from './assets/images/gus_mobile.png';
import gusHeroNew from './assets/images/gus_hero_new.png';
import gusRevision from './assets/images/gus_revision.png';
import gusModal from './assets/images/gus_module_new.png';
import gusChat from './assets/images/gus_chat.png';
import gusFeedback from './assets/images/gus_feedback.png';
import gusMobileView from './assets/images/gus_mobile_view.png';
import gusProtoScreen2 from './assets/images/gus_proto_screen_2.png';
import gusProtoScreen3 from './assets/images/gus_proto_screen_3.png';
import gusMobileLesson from './assets/images/gus_mobile_lesson.png';
import gusMobileDrawer from './assets/images/gus_mobile_drawer.png';
import gusMobileEngagement from './assets/images/gus_mobile_engagement.png';

// Import PressPective images
import perspectiveJournalisticGif from './assets/images/perspective_solution_1.gif';
import perspectiveHero from './assets/images/perspective_hero.png';
import perspectiveCardTop from './assets/images/perspective_card_top.png';
import perspectiveCardBottom from './assets/images/perspective_card_bottom.png';
import perspectiveJournalistic from './assets/images/regenerated_image_1779187158616.png';
import perspectiveSolution2 from './assets/images/perspective_notepad.gif';
import perspectiveInterview from './assets/images/perspective_interview_new.png';
import perspectiveRating from './assets/images/perspective_feedback.png';
import perspectiveRatingDetail from './assets/images/perspective_rating_detail.png';
import perspectiveTeacher from './assets/images/regenerated_image_1779187392577.png';

// PressPective carousel images
import perspectiveTeacher1 from './assets/images/perspective_teacher_1.png';
import perspectiveTeacher2 from './assets/images/perspective_teacher_2.png';
import perspectiveTeacher3 from './assets/images/perspective_teacher_3.png';
import perspectiveTeacher4 from './assets/images/perspective_teacher_4.png';
import perspectiveTeacher5 from './assets/images/perspective_teacher_5.png';
import perspectiveStudent1 from './assets/images/perspective_student_1.png';
import perspectiveStudent2 from './assets/images/perspective_student_2.png';
import perspectiveStudent3 from './assets/images/perspective_student_3.png';
import perspectiveStudent4 from './assets/images/perspective_student_4.png';
import perspectiveStudent5 from './assets/images/perspective_student_5.png';
import perspectiveStudent6 from './assets/images/perspective_student_6.png';

// Import Myzon uploaded image
import myzonCardFront from './assets/images/myzon_card_front.png';
import myzonCardBack from './assets/images/myzon_card_back.png';
import myzonDashboard from './assets/images/regenerated_image_1779705208214.png';
import myzonDashboard2 from './assets/images/regenerated_image_1779705338387.png';
import myzonAnalytics from './assets/images/regenerated_image_1779741713949.png';
import myzonMainMockup from './assets/images/myzon_main_mockup.png';
import myzonCampaignManager from './assets/images/myzon_campaign_manager.png';
import myzonCampaignDesign from './assets/images/myzon_campaign_design.png';
import myzonCampaignPublish from './assets/images/myzon_campaign_publish.png';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'MindEd',
    category: 'Product Design, EdTech',
    description: 'Simplifying the app creation process in a vibe coding platform for educators',
    fullDescription: 'MindEd is a specialized platform designed to empower educators with modern coding tools. This project focused on redesigning the core development area to lower the barrier to entry while maintaining professional-grade functionality. The redesign emphasized clarity, flow, and "vibe coding" principles to make the technical process feel more intuitive and creative.',
    imageUrl: mindedHero,
    thumbnailImages: [
      mindedCardTop,
      mindedCardBottom
    ],
    galleryImages: [
      mindedHero,              // 0: Unique hero
      mindedAfterGif,          // 1: After redesign GIF
      mindedBeforeGif,         // 2: Before redesign GIF
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
    carouselImages: {
      lecturer: [
        gusLecturer01, gusLecturer02, gusLecturer03, gusLecturer04, gusLecturer05,
        gusLecturer06, gusLecturer07, gusLecturer08, gusLecturer09, gusLecturer10
      ],
      studentDesktop: [
        gusStudentDesktop01, gusStudentDesktop02, gusStudentDesktop03,
        gusStudentDesktop04, gusStudentDesktop05, gusStudentDesktop06
      ],
      studentMobile: [
        gusStudentMobile01, gusStudentMobile02, gusStudentMobile03, gusStudentMobile04,
        gusStudentMobile05, gusStudentMobile06, gusStudentMobile07, gusStudentMobile08,
        gusStudentMobile09, gusStudentMobile10
      ],
      titles: {
        lecturer: [
          'Lecturer Login',
          'Module Management',
          'New Module Setup',
          'Analyze Materials',
          'Module Created',
          'AI Generating Lessons',
          'Lesson Review',
          'Lesson Editor',
          'Student Progress',
          'Module Published',
        ],
        studentDesktop: [
          'Personalized Onboarding',
          'Your Module',
          'Student Dashboard',
          'AI-Powered Lesson',
          'Interactive Challenge',
          'Knowledge Checkpoint',
        ],
        studentMobile: [
          'Welcome Screen',
          'Account Setup',
          'Personalized Onboarding',
          'Home',
          'Module Lessons',
          'Active Lesson',
          'Chat Assistant',
          'Typing to Chat',
          'Knowledge Checkpoint',
          'Your Profile',
        ],
      },
    },
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
      perspectiveRating,       // 4: Rating Meter
      perspectiveTeacher,      // 5: Teacher Panel
      perspectiveRatingDetail  // 6: Rating Detail
    ],
    gifUrl: perspectiveJournalisticGif,
    carouselImages: {
      lecturer: [perspectiveTeacher1, perspectiveTeacher2, perspectiveTeacher3, perspectiveTeacher4, perspectiveTeacher5],
      studentDesktop: [perspectiveStudent1, perspectiveStudent2, perspectiveStudent3, perspectiveStudent4, perspectiveStudent5, perspectiveStudent6],
      studentMobile: [],
      titles: {
        lecturer: [
          'Historical Events Library',
          'Story Setup',
          'Student Entry Code',
          'Live Class Dashboard',
          'My Sessions',
        ],
        studentDesktop: [
          'Student Entry',
          'Question Preparation',
          'Writing a Question',
          'The Live Interview',
          'Bonus Time Reward',
          'Final Leaderboard',
        ],
        studentMobile: [],
      },
    },
    year: '2024',
    role: 'Sole Product Designer',
    tags: ['EdTech', 'History', 'UX UI'],
  },
  {
    id: '4',
    title: 'Myzon',
    category: 'AI, Product Design',
    description: 'Designing an AI-powered platform for Amazon sellers to generate smart marketing materials',
    fullDescription: 'Myzon is an intelligent platform designed to streamline and automate marketing asset generation for Amazon sellers. The solution leverages generative AI workflows and structured systems thinking to produce cohesive, high-conversion visual and written brand materials designed specifically to meet Amazon marketplace standards.',
    imageUrl: myzonMainMockup,
    thumbnailImages: [
      myzonCardFront,
      myzonCardBack
    ],
    galleryImages: [
      myzonDashboard2,             // 0: System Overview
      myzonAnalytics,              // 1: Performance Analytics
      myzonCampaignManager,        // 2: Campaign Manager
      myzonCampaignDesign,         // 3: Campaign Generation / Design and content
      myzonCampaignPublish         // 4: Campaign Generation / Caption and publish
    ],
    year: '2023',
    role: 'Sole Product Designer',
    tags: ['AI', 'E-commerce', 'Product Design'],
  },
];
