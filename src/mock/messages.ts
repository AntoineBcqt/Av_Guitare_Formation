import type { Conversation } from '../types';

export const conversations: Conversation[] = [
  {
    id: 'conv1',
    participantId: 't1',
    participantName: 'Alexandre Dupont',
    participantInitials: 'AD',
    lastMessage: 'N\'hésitez pas si vous avez d\'autres questions !',
    lastMessageTime: 'Aujourd\'hui, 14:32',
    unread: true,
    messages: [
      {
        id: 'm1',
        senderId: 'u1',
        content: 'Bonjour Alexandre ! Je viens de commencer votre cours "Guitare débutant — Les bases" et je voulais vous remercier pour la qualité des explications. C\'est vraiment très bien structuré.',
        timestamp: 'Hier, 10:15',
        type: 'text',
      },
      {
        id: 'm2',
        senderId: 't1',
        content: 'Bonjour Jules ! Je suis vraiment content que le cours vous plaise. N\'hésitez pas à me poser des questions si vous bloquez sur quelque chose. C\'est exactement pour ça que je suis là.',
        timestamp: 'Hier, 10:42',
        type: 'text',
      },
      {
        id: 'm3',
        senderId: 'u1',
        content: 'Justement, j\'ai une question sur le barré de Fa. Je n\'arrive vraiment pas à le faire sonner proprement. Tous les tutoriels que j\'ai vus me disent des choses différentes sur comment positionner le pouce...',
        timestamp: 'Hier, 11:05',
        type: 'text',
      },
      {
        id: 'm4',
        senderId: 't1',
        content: 'Le barré de Fa est LE grand classique qui bloque tous les débutants ! Je vous ai préparé un guide PDF avec les positions exactes du pouce et des exercices progressifs. Commencez par le "demi-barré" sur les 2 premières cordes seulement.',
        timestamp: 'Hier, 11:30',
        type: 'text',
      },
      {
        id: 'm5',
        senderId: 't1',
        content: 'Guide barré de Fa — Exercices progressifs',
        timestamp: 'Hier, 11:31',
        type: 'file',
        fileName: 'Guide barré de Fa.pdf',
        fileSize: '2.4 MB',
        fileType: 'pdf',
      },
      {
        id: 'm6',
        senderId: 'u1',
        content: 'Merci beaucoup ! J\'ai essayé avec votre guide et c\'est déjà beaucoup mieux. Voilà une photo de ma position de main, est-ce que c\'est correct ?',
        timestamp: 'Aujourd\'hui, 09:20',
        type: 'text',
      },
      {
        id: 'm7',
        senderId: 'u1',
        content: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80',
        timestamp: 'Aujourd\'hui, 09:21',
        type: 'image',
      },
      {
        id: 'm8',
        senderId: 't1',
        content: 'Très bien Jules ! La position du pouce est bonne. Juste un petit détail : essayez de placer votre index juste derrière la frette (pas dessus) pour optimiser la pression. Continuez comme ça, vous progressez vraiment bien ! N\'hésitez pas si vous avez d\'autres questions !',
        timestamp: 'Aujourd\'hui, 14:32',
        type: 'text',
      },
    ],
  },
];
