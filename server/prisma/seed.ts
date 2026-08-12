import "dotenv/config";
import { PrismaClient, TaskStatus, TaskPriority } from "@prisma/client";

// const prisma = new PrismaClient();
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Wipe existing data so the seed script can be run repeatedly during development
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const websiteRedesign = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description:
        "Redesign the company marketing website with a modern look and improved performance.",
    },
  });

  const mobileAppLaunch = await prisma.project.create({
    data: {
      name: "Mobile App Launch",
      description:
        "Plan and execute the launch of the v1 mobile app on iOS and Android.",
    },
  });

  const portfolioWebsite = await prisma.project.create({
    data: {
      name: "Portfolio Website",
      description:
        "Build and deploy a personal portfolio site to showcase recent projects.",
    },
  });

  await prisma.task.createMany({
    data: [
      // Website Redesign
      {
        projectId: websiteRedesign.id,
        title: "Create homepage wireframes",
        description: "Sketch out the layout for the new homepage in Figma.",
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date("2026-07-15"),
      },
      {
        projectId: websiteRedesign.id,
        title: "Build responsive homepage",
        description: "Implement the homepage using React and Tailwind CSS.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date("2026-08-20"),
      },
      {
        projectId: websiteRedesign.id,
        title: "Set up contact form",
        description: "Add a contact form with validation and email delivery.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date("2026-08-25"),
      },
      {
        projectId: websiteRedesign.id,
        title: "Cross-browser testing",
        description: "Test the site in Chrome, Firefox, and Safari.",
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date("2026-09-01"),
      },
      // Mobile App Launch
      {
        projectId: mobileAppLaunch.id,
        title: "Finalize App Store listing",
        description: "Write the App Store description and prepare screenshots.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date("2026-09-10"),
      },
      {
        projectId: mobileAppLaunch.id,
        title: "Fix onboarding flow bug",
        description:
          "Users are getting stuck on step 2 of onboarding on Android.",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date("2026-08-18"),
      },
      {
        projectId: mobileAppLaunch.id,
        title: "Set up crash reporting",
        description: "Integrate a crash reporting tool before launch.",
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date("2026-08-01"),
      },
      // Portfolio Website
      {
        projectId: portfolioWebsite.id,
        title: "Write project case studies",
        description:
          "Document 3 recent projects with problem, approach, and outcome.",
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date("2026-08-30"),
      },
      {
        projectId: portfolioWebsite.id,
        title: "Deploy to Vercel",
        description: "Connect the GitHub repo and deploy the production build.",
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      },
    ],
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// import "dotenv/config";
// import { PrismaClient, TaskStatus, TaskPriority } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });

// const prisma = new PrismaClient({ adapter });

// async function main() {
//   // Wipe existing data so the seed script can be run repeatedly during development
//   await prisma.task.deleteMany();
//   await prisma.project.deleteMany();

//   const websiteRedesign = await prisma.project.create({
//     data: {
//       name: "Website Redesign",
//       description:
//         "Redesign the company marketing website with a modern look and improved performance.",
//     },
//   });

//   const mobileAppLaunch = await prisma.project.create({
//     data: {
//       name: "Mobile App Launch",
//       description:
//         "Plan and execute the launch of the v1 mobile app on iOS and Android.",
//     },
//   });

//   const portfolioWebsite = await prisma.project.create({
//     data: {
//       name: "Portfolio Website",
//       description:
//         "Build and deploy a personal portfolio site to showcase recent projects.",
//     },
//   });

//   await prisma.task.createMany({
//     data: [
//       // Website Redesign
//       {
//         projectId: websiteRedesign.id,
//         title: "Create homepage wireframes",
//         description: "Sketch out the layout for the new homepage in Figma.",
//         status: TaskStatus.DONE,
//         priority: TaskPriority.HIGH,
//         dueDate: new Date("2026-07-15"),
//       },
//       {
//         projectId: websiteRedesign.id,
//         title: "Build responsive homepage",
//         description: "Implement the homepage using React and Tailwind CSS.",
//         status: TaskStatus.IN_PROGRESS,
//         priority: TaskPriority.HIGH,
//         dueDate: new Date("2026-08-20"),
//       },
//       {
//         projectId: websiteRedesign.id,
//         title: "Set up contact form",
//         description: "Add a contact form with validation and email delivery.",
//         status: TaskStatus.TODO,
//         priority: TaskPriority.MEDIUM,
//         dueDate: new Date("2026-08-25"),
//       },
//       {
//         projectId: websiteRedesign.id,
//         title: "Cross-browser testing",
//         description: "Test the site in Chrome, Firefox, and Safari.",
//         status: TaskStatus.TODO,
//         priority: TaskPriority.LOW,
//         dueDate: new Date("2026-09-01"),
//       },

//       // Mobile App Launch
//       {
//         projectId: mobileAppLaunch.id,
//         title: "Finalize App Store listing",
//         description: "Write the App Store description and prepare screenshots.",
//         status: TaskStatus.TODO,
//         priority: TaskPriority.MEDIUM,
//         dueDate: new Date("2026-09-10"),
//       },
//       {
//         projectId: mobileAppLaunch.id,
//         title: "Fix onboarding flow bug",
//         description:
//           "Users are getting stuck on step 2 of onboarding on Android.",
//         status: TaskStatus.IN_PROGRESS,
//         priority: TaskPriority.HIGH,
//         dueDate: new Date("2026-08-18"),
//       },
//       {
//         projectId: mobileAppLaunch.id,
//         title: "Set up crash reporting",
//         description: "Integrate a crash reporting tool before launch.",
//         status: TaskStatus.DONE,
//         priority: TaskPriority.MEDIUM,
//         dueDate: new Date("2026-08-01"),
//       },

//       // Portfolio Website
//       {
//         projectId: portfolioWebsite.id,
//         title: "Write project case studies",
//         description:
//           "Document 3 recent projects with problem, approach, and outcome.",
//         status: TaskStatus.TODO,
//         priority: TaskPriority.HIGH,
//         dueDate: new Date("2026-08-30"),
//       },
//       {
//         projectId: portfolioWebsite.id,
//         title: "Deploy to Vercel",
//         description: "Connect the GitHub repo and deploy the production build.",
//         status: TaskStatus.TODO,
//         priority: TaskPriority.MEDIUM,
//       },
//     ],
//   });

//   console.log("Seed data created successfully.");
// }

// main()
//   .catch((error) => {
//     console.error("Error seeding database:", error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
