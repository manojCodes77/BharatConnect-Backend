import mongoose from "mongoose";
import User from "../models/user-model";
import Post from "../models/post-model";
import dotenv from "dotenv";

dotenv.config();

const dummyPosts = [
    {
        title: "Excited to announce my new role at Tech Mahindra!",
        content: "I'm thrilled to share that I've joined Tech Mahindra as a Senior Software Engineer. Looking forward to working on cutting-edge technologies and contributing to digital transformation initiatives. #NewBeginnings #TechMahindra",
    },
    {
        title: "Just completed AWS Solutions Architect certification!",
        content: "After months of preparation, I'm proud to have cleared the AWS Solutions Architect - Associate certification. Thanks to everyone who supported me on this journey. #AWS #CloudComputing #Certification",
    },
    {
        title: "Celebrating 5 years at Infosys",
        content: "Today marks my 5th work anniversary at Infosys! It's been an incredible journey of growth and learning. Grateful for all the amazing colleagues and mentors I've had along the way. #Infosys #WorkAnniversary",
    },
    {
        title: "Thoughts on India's Digital Payment Revolution",
        content: "UPI has transformed the way India transacts. With over 10 billion transactions per month, we're witnessing a true digital revolution. What are your thoughts on the future of fintech in India? #UPI #DigitalIndia #Fintech",
    },
    {
        title: "Attending Google I/O Extended Bangalore this weekend",
        content: "Excited to attend Google I/O Extended in Bangalore! Looking forward to learning about the latest in AI, Android, and cloud technologies. See you there! #GoogleIO #TechCommunity #Bangalore",
    },
    {
        title: "Hiring: React Developers for our Pune office",
        content: "We're looking for talented React developers to join our growing team in Pune. 2-4 years of experience required. Competitive salary and great work culture. DM me for details! #Hiring #ReactJS #Pune #JobOpportunity",
    },
    {
        title: "Launched my first mobile app on Play Store!",
        content: "Finally published my side project - a productivity app built with Flutter. It's been a challenging but rewarding journey from idea to launch. Check it out and let me know your feedback! #Flutter #AppDevelopment #IndieHacker",
    },
    {
        title: "Key takeaways from Nasscom Technology Conference",
        content: "Just attended the Nasscom Technology Conference in Mumbai. Major focus on AI/ML, cybersecurity, and sustainable tech. India is definitely leading in innovation! #Nasscom #TechConference #Innovation",
    },
    {
        title: "Work-Life Balance in Indian IT Industry",
        content: "Let's talk about work-life balance in the IT sector. With hybrid work becoming the norm, how are you maintaining boundaries? Share your tips and experiences! #WorkLifeBalance #ITIndustry #MentalHealth",
    },
    {
        title: "Completed my first marathon in Mumbai!",
        content: "Crossed the finish line at the Mumbai Marathon today! 42.2 km of pure determination. A big thank you to everyone who cheered me on. Fitness goals achieved! 🏃‍♂️ #MumbaiMarathon #Fitness #Achievement",
    },
    {
        title: "Starting a new venture in EdTech",
        content: "After years in corporate, I'm taking the entrepreneurial leap! Launching an EdTech platform to make quality education accessible to tier 2 and tier 3 cities in India. Wish me luck! #Startup #EdTech #Entrepreneurship",
    },
    {
        title: "Python vs JavaScript: Which one should beginners learn?",
        content: "This is a question I get asked a lot by aspiring developers. Here's my take: Both are great, but Python has a gentler learning curve. JavaScript is essential for web development. What's your opinion? #Programming #CareerAdvice",
    },
];

const seedPosts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to MongoDB");

        // Get all users
        const users = await User.find({});
        
        if (users.length === 0) {
            console.log("No users found. Please run seed:users first.");
            await mongoose.disconnect();
            return;
        }

        console.log(`Found ${users.length} users`);

        // Clear existing posts (optional - comment out if you want to keep existing posts)
        await Post.deleteMany({});
        console.log("Cleared existing posts");

        // Assign posts to random users with interaction data
        const postsWithAuthors = dummyPosts.map((post) => {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            // Generate random likes (2-15 users liking each post)
            const numLikes = Math.floor(Math.random() * 14) + 2;
            const likesSet = new Set<string>();
            while (likesSet.size < Math.min(numLikes, users.length)) {
                const randomLiker = users[Math.floor(Math.random() * users.length)];
                likesSet.add(randomLiker._id.toString());
            }
            const likes = Array.from(likesSet);

            // Generate random comments (0-5 comments per post)
            const numComments = Math.floor(Math.random() * 6);
            const comments = [];
            const commentTexts = [
                "Great insights! Thanks for sharing.",
                "Congratulations! Well deserved.",
                "This is really inspiring. Keep it up!",
                "Totally agree with your perspective.",
                "Would love to connect and discuss this further.",
                "Amazing achievement! @Rahul what do you think?",
                "This resonates with me. @Priya have you seen this?",
                "Excellent point! Looking forward to more posts like this.",
                "Congrats on this milestone!",
                "Very informative. Thanks!",
            ];

            for (let i = 0; i < numComments; i++) {
                const randomCommenter = users[Math.floor(Math.random() * users.length)];
                const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
                
                // Randomly add mentions to some comments
                const mentions = [];
                if (Math.random() > 0.7) {
                    const mentionedUser = users[Math.floor(Math.random() * users.length)];
                    mentions.push(mentionedUser._id);
                }

                comments.push({
                    userId: randomCommenter._id,
                    text: randomText,
                    mentions,
                    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
                });
            }

            // Generate random shares (0-10)
            const sharesCount = Math.floor(Math.random() * 11);

            return {
                ...post,
                authorId: randomUser._id,
                likes,
                likesCount: likes.length,
                comments,
                commentsCount: comments.length,
                sharesCount,
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
                updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            };
        });

        // Insert dummy posts
        await Post.insertMany(postsWithAuthors);
        console.log(`${postsWithAuthors.length} dummy posts inserted successfully with interactions`);

        // Disconnect
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error seeding posts:", error);
        process.exit(1);
    }
};

seedPosts();
