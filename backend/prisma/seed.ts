import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AbleSpace database...');

  // Clean existing tables
  await prisma.comment.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.taskLabel.deleteMany({});
  await prisma.taskMember.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.label.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const guestUser = await prisma.user.create({
    data: {
      email: 'guest@ablespace.io',
      name: 'Guest User',
      username: 'guest_user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: 'Full Stack Engineer',
      isGuest: true,
      theme: 'light',
      colorMode: 'blue',
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.chen@ablespace.io',
      name: 'Sarah Chen',
      username: 'sarah_c',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      title: 'Senior Frontend Engineer',
    },
  });

  const alex = await prisma.user.create({
    data: {
      email: 'alex.rivera@ablespace.io',
      name: 'Alex Rivera',
      username: 'alex_r',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      title: 'Lead Product Designer',
    },
  });

  const michael = await prisma.user.create({
    data: {
      email: 'michael.scott@ablespace.io',
      name: 'Michael Scott',
      username: 'michael_s',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      title: 'Engineering Manager',
    },
  });

  const emily = await prisma.user.create({
    data: {
      email: 'emily.watson@ablespace.io',
      name: 'Emily Watson',
      username: 'emily_w',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      title: 'QA Lead Engineer',
    },
  });

  // 2. Create Labels
  const labelDesign = await prisma.label.create({ data: { name: 'Design', color: 'pink' } });
  const labelFrontend = await prisma.label.create({ data: { name: 'Frontend', color: 'blue' } });
  const labelBackend = await prisma.label.create({ data: { name: 'Backend', color: 'purple' } });
  const labelQA = await prisma.label.create({ data: { name: 'QA', color: 'emerald' } });
  const labelDevOps = await prisma.label.create({ data: { name: 'DevOps', color: 'amber' } });
  const labelSecurity = await prisma.label.create({ data: { name: 'Security', color: 'rose' } });

  // 3. Create Projects
  const projectWebApp = await prisma.project.create({
    data: {
      name: 'AbleSpace Web App v2.0',
      description: 'Main web application redesign and full-stack API overhaul.',
      priority: 'HIGH',
      leadId: michael.id,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const projectDesignSystem = await prisma.project.create({
    data: {
      name: 'Design System & UI Specs',
      description: 'Figma tokens, dark theme support, and reusable component library.',
      priority: 'URGENT',
      leadId: alex.id,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
  });

  const projectSecurity = await prisma.project.create({
    data: {
      name: 'Payment & Infrastructure Audit',
      description: 'Stripe gateway integration and compliance security audit.',
      priority: 'MEDIUM',
      leadId: sarah.id,
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
  });

  // 4. Create Tasks matching Figma design list
  const tasksData = [
    {
      title: 'Design Homepage',
      description: 'Create high-fidelity mockups for landing page and dashboard hero section.',
      status: 'TO_DO' as const,
      priority: 'HIGH' as const,
      team: 'Design Team',
      resources: 'https://figma.com/file/homepage-v2',
      projectId: projectDesignSystem.id,
      reporterId: alex.id,
      members: [alex.id, sarah.id],
      labels: [labelDesign.id],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Create wireframes', completed: true },
        { title: 'Define color tokens', completed: true },
        { title: 'Finalize mobile layout', completed: false },
      ],
      comments: [
        { authorId: alex.id, content: 'Initial mockup version published in Figma for review.' },
        { authorId: sarah.id, content: 'Looks great! Starting frontend grid layout preparation.' },
      ],
    },
    {
      title: 'Develop Login Feature',
      description: 'Implement guest authentication flow and session management in NestJS.',
      status: 'DOING' as const,
      priority: 'URGENT' as const,
      team: 'Frontend Team',
      resources: 'https://docs.nestjs.com/security/authentication',
      projectId: projectWebApp.id,
      reporterId: guestUser.id,
      members: [guestUser.id, sarah.id],
      labels: [labelFrontend.id, labelBackend.id],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Setup JWT guest endpoint', completed: true },
        { title: 'Build login page UI', completed: true },
        { title: 'Add guest login handler', completed: true },
        { title: 'Integrate refresh persistence', completed: false },
      ],
      comments: [
        { authorId: guestUser.id, content: 'Guest login endpoint is functional and returning JWT payload.' },
      ],
    },
    {
      title: 'Test Payment Gateway',
      description: 'Verify payment webhooks, sandbox card transactions, and receipt emails.',
      status: 'TO_DO' as const,
      priority: 'MEDIUM' as const,
      team: 'QA Team',
      projectId: projectSecurity.id,
      reporterId: emily.id,
      members: [emily.id],
      labels: [labelQA.id, labelSecurity.id],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Test successful subscription flow', completed: false },
        { title: 'Test card decline handling', completed: false },
      ],
      comments: [],
    },
    {
      title: 'Write API Documentation',
      description: 'Generate OpenAPI/Swagger specifications for Tasks, Projects, and User endpoints.',
      status: 'DOING' as const,
      priority: 'MEDIUM' as const,
      team: 'Backend Team',
      projectId: projectWebApp.id,
      reporterId: michael.id,
      members: [sarah.id, guestUser.id],
      labels: [labelBackend.id],
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Document Task DTO schemas', completed: true },
        { title: 'Add example request bodies', completed: false },
      ],
      comments: [
        { authorId: michael.id, content: 'Please ensure all validation error formats are clearly documented.' },
      ],
    },
    {
      title: 'Implement Search Function',
      description: 'Add debounced title, description, and label search across Board and List views.',
      status: 'TO_DO' as const,
      priority: 'HIGH' as const,
      team: 'Frontend Team',
      projectId: projectWebApp.id,
      reporterId: sarah.id,
      members: [sarah.id],
      labels: [labelFrontend.id],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Create search input component', completed: true },
        { title: 'Add client-side filtering logic', completed: false },
      ],
      comments: [],
    },
    {
      title: 'Deploy to Production',
      description: 'Configure Vercel frontend build and Render/Railway NestJS backend deployment.',
      status: 'ON_HOLD' as const,
      priority: 'URGENT' as const,
      team: 'DevOps Team',
      projectId: projectWebApp.id,
      reporterId: michael.id,
      members: [michael.id, guestUser.id],
      labels: [labelDevOps.id],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Set up staging environment', completed: true },
        { title: 'Configure SSL certificates', completed: false },
      ],
      comments: [
        { authorId: michael.id, content: 'Waiting for final security audit signoff before production deployment.' },
      ],
    },
    {
      title: 'Code Review Completed',
      description: 'Review task filter hooks, theme provider state, and NestJS controllers.',
      status: 'COMPLETED' as const,
      priority: 'LOW' as const,
      team: 'Engineering',
      projectId: projectWebApp.id,
      reporterId: michael.id,
      members: [sarah.id, michael.id],
      labels: [labelFrontend.id, labelBackend.id],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Check TypeScript strict compliance', completed: true },
        { title: 'Verify responsive CSS styling', completed: true },
      ],
      comments: [
        { authorId: sarah.id, content: 'Code review approved with zero blocking issues.' },
      ],
    },
    {
      title: 'Design Mockups Finalized',
      description: 'Complete Figma UI frames for Board view, List view, and Task detail drawer.',
      status: 'COMPLETED' as const,
      priority: 'HIGH' as const,
      team: 'Design Team',
      projectId: projectDesignSystem.id,
      reporterId: alex.id,
      members: [alex.id],
      labels: [labelDesign.id],
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Export PNG icon assets', completed: true },
        { title: 'Publish typography guide', completed: true },
      ],
      comments: [],
    },
    {
      title: 'Feature Testing Passed',
      description: 'Execute automated regression suite and manual cross-browser testing.',
      status: 'COMPLETED' as const,
      priority: 'MEDIUM' as const,
      team: 'QA Team',
      projectId: projectWebApp.id,
      reporterId: emily.id,
      members: [emily.id],
      labels: [labelQA.id],
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Test Chrome, Safari, Edge', completed: true },
        { title: 'Test dark theme contrast ratio', completed: true },
      ],
      comments: [],
    },
    {
      title: 'UI Design Updated',
      description: 'Refine side navigation active states, font weights, and border radii.',
      status: 'COMPLETED' as const,
      priority: 'LOW' as const,
      team: 'Design Team',
      projectId: projectDesignSystem.id,
      reporterId: alex.id,
      members: [alex.id, guestUser.id],
      labels: [labelDesign.id],
      dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      subtasks: [],
      comments: [],
    },
    {
      title: 'Security Audit Scheduled',
      description: 'Conduct third-party penetration testing and vulnerability scan.',
      status: 'ON_HOLD' as const,
      priority: 'URGENT' as const,
      team: 'Security Team',
      projectId: projectSecurity.id,
      reporterId: michael.id,
      members: [michael.id, emily.id],
      labels: [labelSecurity.id],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      subtasks: [
        { title: 'Prepare audit scope document', completed: true },
        { title: 'Provide API credentials', completed: false },
      ],
      comments: [],
    },
  ];

  for (const item of tasksData) {
    const { members, labels, subtasks, comments, ...taskFields } = item;

    const task = await prisma.task.create({
      data: {
        ...taskFields,
        members: {
          create: members.map((userId) => ({ userId })),
        },
        labels: {
          create: labels.map((labelId) => ({ labelId })),
        },
        subtasks: {
          create: subtasks.map((st) => ({
            title: st.title,
            completed: st.completed,
            priority: item.priority,
            dueDate: item.dueDate,
          })),
        },
        comments: {
          create: comments.map((c) => ({
            content: c.content,
            authorId: c.authorId,
          })),
        },
      },
    });
    console.log(`Created task: ${task.title} (${task.status})`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
