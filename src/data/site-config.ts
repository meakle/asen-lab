export type Image = {
    src: string
    alt?: string
    caption?: string
}

export type Link = {
    text: string
    href: string
}

export type Hero = {
    title?: string
    text?: string
    image?: Image
    actions?: Link[]
}

export type Subscribe = {
    title?: string
    text?: string
    formUrl: string
}

export type SiteConfig = {
    logo?: Image
    title: string
    subtitle?: string
    description: string
    image?: Image
    headerNavLinks?: Link[]
    footerNavLinks?: Link[]
    socialLinks?: Link[]
    hero?: Hero
    subscribe?: Subscribe
    postsPerPage?: number
    projectsPerPage?: number
}

const siteConfig: SiteConfig = {
    title: "Asen's Blog",
    subtitle: '',
    description: '',
    headerNavLinks: [
        {
            text: '主页',
            href: '/'
        },
        // {
        //     text: '项目',
        //     href: '/projects'
        // },
        {
            text: '生活',
            href: '/blog'
        },
        {
            text: '技术',
            href: '/teachBlog'
        },
        // {
        //     text: '记录',
        //     href: '/record'
        // },
        // {
        //     text: '关于',
        //     href: '/about'
        // }
    ],
    footerNavLinks: [],
    socialLinks: [],
    hero: {
        title: 'Hi There & Welcome to My Corner of the Web!',
        text: "I'm **Ethan Donovan**, a web developer at Amazing Studio, dedicated to the realms of collaboration and artificial intelligence. My approach involves embracing intuition, conducting just enough research, and leveraging aesthetics as a catalyst for exceptional products. I have a profound appreciation for top-notch software, visual design, and the principles of product-led growth. Feel free to explore some of my coding endeavors on <a href='https://github.com/JustGoodUI/dante-astro-theme'>GitHub</a> or follow me on <a href='https://twitter.com/justgoodui'>Twitter/X</a>.",
        image: {
            src: '/hero.jpeg',
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    // subscribe: {
        // title: 'Subscribe to Dante Newsletter',
        // text: 'One update per week. All the latest posts directly in your inbox.',
        // formUrl: '#'
    // },
    postsPerPage: 8,
    projectsPerPage: 8
}

export default siteConfig
