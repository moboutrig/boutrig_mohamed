document.addEventListener('DOMContentLoaded', async () => {
    // Fetch the portfolio data from the JSON file
    const response = await fetch('data.json');
    const portfolioData = await response.json();

    // --- Main Initialization Function ---
    function initializePage() {
        populatePageContent();
        initializeNavigation();
        initializeInteractiveElements();
        initializeAnimations();
    }

    // --- Image Fallback Helper ---
    function createIconHtml(iconKey, altText) {
        const { logoUrls, emojiFallbacks } = portfolioData;
        const emoji = emojiFallbacks[iconKey] || emojiFallbacks.default;
        const url = logoUrls[iconKey];
        if (!url) return `<span class='emoji-fallback' title='${altText}'>${emoji}</span>`;
        return `<img src="${url}" alt="${altText}" onerror="this.onerror=null; this.outerHTML = '<span class=\\'emoji-fallback\\' title=\\'${altText}\\'>${emoji}</span>';">`;
    }

    // --- Content Population Functions ---
    function populatePageContent() {
        const { persona, urls, sectionTitles, projects, skills, masterclasses, socialProof, community, footerText } = portfolioData;
        const createSection = (id, title) => {
            const section = document.getElementById(id);
            section.innerHTML = (title ? `<h2 class="section-title">${title}</h2>` : '') + '<div class="content-container"></div>';
            return section.querySelector('.content-container');
        };
        
        document.getElementById('header').innerHTML = `<img id="profile-image" src="${urls.profileImage}" alt="Profile image of ${persona.name}" onerror="this.style.display='none'"><h1 class="reveal">${persona.name}</h1><p class="subtitle reveal">${persona.subtitle}</p><p class="header-quote reveal">${persona.headerQuote}</p><div class="reveal"><a href="${urls.resume}" class="btn-resume" target="_blank" rel="noopener noreferrer">View Resume</a></div>`;
        createSection('about', sectionTitles.about).innerHTML = `<div class="about-content"><p>${persona.aboutText}</p></div>`;
        
        const projectsContainer = createSection('portfolio-projects', sectionTitles.projects);
        projectsContainer.classList.add('projects-grid');
        projects.forEach((project, index) => {
            const slidesHtml = project.visuals.map((v, i) => `<div class="image-carousel-slide ${i === 0 ? 'active' : ''}"><img src="${v.url}" alt="${project.title} slide"></div>`).join('');
            const techStackHtml = project.techStack.map(tech => `<span>${createIconHtml(tech.icon, tech.name)} ${tech.name}</span>`).join('');
            const keyResultsHtml = project.keyResults.map(r => `<li>${r}</li>`).join('');
            const useCasesHtml = project.useCases ? `<div class="project-details collapsible-mobile"><h4><span class="emoji">🎯</span> ${project.useCases.title}</h4><div class="collapsible-content"><ul>${project.useCases.items.map(item => `<li>${item}</li>`).join('')}</ul></div></div>` : '';
            let agentDetailsHtml = project.agentDetails ? `<div class="agent-details-grid">${project.agentDetails.map(agent => `<div class="agent-card reveal"><h4>${createIconHtml(agent.icon, agent.title)} ${agent.title}</h4><p>${agent.description}</p><ul>${agent.responsibilities.map(res => `<li>${res}</li>`).join('')}</ul></div>`).join('')}</div>` : '';

            projectsContainer.innerHTML += `
            <div class="project-container">
                <div class="project-card reveal">
                    <div id="carousel-${index}" class="image-carousel-container">${slidesHtml}</div>
                    <div class="project-card-content">
                        <div class="industry-tag">${project.industry}</div><h3>${project.title}</h3><p>${project.description}</p>${useCasesHtml}
                        <div class="project-details collapsible-mobile"><h4><span class="emoji">📈</span> Key Results</h4><div class="collapsible-content"><ul>${keyResultsHtml}</ul></div></div>
                        <div class="project-details collapsible-mobile"><h4><span class="emoji">⚙️</span> Core Tech</h4><div class="collapsible-content"><div class="tech-stack">${techStackHtml}</div></div></div>
                        <div class="project-actions"><a href="${project.demoUrl}" class="btn btn-primary">Live Demo</a><a href="${project.sourceUrl}" class="btn btn-secondary">Source Code</a><a href="${project.caseStudyUrl}" class="btn btn-secondary">Case Study</a></div>
                    </div>
                </div>
                ${agentDetailsHtml}
            </div>`;
        });
        
        const skillsContainer = createSection('skills', sectionTitles.skills); 
        skillsContainer.classList.add('bento-grid'); 
        skills.forEach(cat => { 
            const itemsHtml = cat.items.map(item => `<li>${createIconHtml(item.icon, item.name)}<span>${item.name}</span></li>`).join(''); 
            skillsContainer.innerHTML += `<div class="bento-item"><h3>${cat.category}</h3><ul>${itemsHtml}</ul></div>`; 
        });

        const masterclassesContainer = createSection('masterclasses', sectionTitles.masterclasses);
        masterclassesContainer.parentElement.insertBefore(document.createRange().createContextualFragment(`<div style="text-align: center; margin: -40px 0 60px 0;"><a href="#" class="btn-resume">Start Learning</a></div>`), masterclassesContainer);
        masterclassesContainer.classList.add('bento-grid');
        masterclasses.courses.forEach(c => {
            masterclassesContainer.innerHTML += `
                <div class="bento-item course-card">
                    <div class="course-thumbnail" style="background-image: url('${c.thumbnailUrl}')"><div class="play-button">▶</div></div>
                    <div class="course-content"><h3>${c.title}</h3><p class="course-author">${c.author}</p><p>${c.description}</p><a href="#" class="btn btn-secondary" style="margin-top: auto;">Start Course</a></div>
                </div>`;
        });
        masterclassesContainer.innerHTML += `
            <div class="bento-item book-card">
                <img src="${masterclasses.book.coverUrl}" alt="Book Cover" onerror="this.style.display='none'"><div class="book-card-content">
                    <h3>${masterclasses.book.title}</h3><p class="course-author">${masterclasses.book.author}</p><p>${masterclasses.book.description}</p><a href="#" class="btn btn-secondary" style="margin-top: 15px;">Read Now</a>
                </div>
            </div>`;

        const testimonialsContainer = createSection('testimonials', sectionTitles.testimonials); 
        testimonialsContainer.classList.add('testimonials-grid'); 
        socialProof.testimonials.forEach(t => { testimonialsContainer.innerHTML += `<div class="testimonial-card reveal"><blockquote>“${t.quote}”</blockquote><div class="author">${t.author}<span>${t.title}</span></div></div>`; });
        
        const communityContainer = createSection('community', sectionTitles.community); 
        communityContainer.classList.add('bento-grid'); 
        Object.values(community).forEach(sec => { 
            const linksHtml = sec.items.map(item => `<a href="${item.url}">${createIconHtml(item.icon, item.text)} ${item.text}</a>`).join(''); 
            communityContainer.innerHTML += `<div class="bento-item animated reveal"><h3>${sec.title}</h3>${linksHtml}</div>`; 
        });

        const clientsContainer = createSection('clients', sectionTitles.clients); 
        clientsContainer.classList.add('client-logos'); 
        socialProof.clients.forEach(c => { clientsContainer.innerHTML += createIconHtml(c.logo, c.name); });
        
        createSection('contact-form', sectionTitles.contact).innerHTML = `<div id="contact-form-container"><form action="${urls.formspree}" method="POST"><div class="form-group"><label for="name">Name</label><input type="text" id="name" name="name" required></div><div class="form-group"><label for="email">Email</label><input type="email" id="email" name="email" required></div><div class="form-group"><label for="message">Message</label><textarea id="message" name="message" rows="5" required></textarea></div><button type="submit" class="btn-submit">Send</button></form></div>`;
        document.getElementById('footer').textContent = `© ${new Date().getFullYear()} ${persona.name}. ${footerText}`;
    }
    
    function initializeNavigation() {
        const { persona, urls } = portfolioData;
        const navLinksContainer = document.getElementById('nav-links');
        const navBurger = document.getElementById('nav-burger');
        
        document.querySelector('.nav-logo').innerHTML = `<img src="${urls.profileImage}" alt="Profile Logo" class="nav-logo-img" onerror="this.style.display='none'"><a href="#">${persona.name}</a>`;
        navLinksContainer.innerHTML = `<li><a href="#about">About</a></li><li><a href="#portfolio-projects">Projects</a></li><li><a href="#skills">Skills</a></li><li><a href="#masterclasses">Masterclasses</a></li><li class="nav-social-item"><a href="${urls.email}" title="Email">${createIconHtml('emailIcon', 'Email')}</a></li><li class="nav-social-item"><a href="${urls.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn">${createIconHtml('linkedinIcon', 'LinkedIn')}</a></li><li class="nav-social-item"><a href="${urls.github}" target="_blank" rel="noopener noreferrer" title="GitHub">${createIconHtml('github', 'GitHub')}</a></li><li><a href="#contact-form" class="nav-contact-btn">Contact</a></li>`;

        navBurger.addEventListener('click', () => { navLinksContainer.classList.toggle('active'); navBurger.classList.toggle('toggle'); });
        navLinksContainer.addEventListener('click', (e) => { if (e.target.tagName === 'A' && navLinksContainer.classList.contains('active')) { navLinksContainer.classList.remove('active'); navBurger.classList.remove('toggle'); } });
    }
    
    function initializeInteractiveElements() {
        (function initializeCustomCursor() {
            const cursorDot = document.querySelector('.cursor-dot'); const cursorOutline = document.querySelector('.cursor-outline');
            window.addEventListener('mousemove', e => { cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`; cursorOutline.style.left = `${e.clientX}px`; cursorOutline.style.top = `${e.clientY}px`; });
            document.body.addEventListener('mouseleave', () => { cursorDot.classList.add('cursor-hidden'); cursorOutline.classList.add('cursor-hidden'); });
            document.body.addEventListener('mouseenter', () => { cursorDot.classList.remove('cursor-hidden'); cursorOutline.classList.remove('cursor-hidden'); });
            document.querySelectorAll('a, button, .bento-item, .project-card, .nav-burger, .collapsible-mobile > h4, .agent-card').forEach(el => {
                el.addEventListener('mouseenter', () => { cursorDot.classList.add('cursor-link-hover'); cursorOutline.classList.add('cursor-link-hover'); });
                el.addEventListener('mouseleave', () => { cursorDot.classList.remove('cursor-link-hover'); cursorOutline.classList.remove('cursor-link-hover'); });
            });
        })();
        
        (function initializeCollapsibleCards() {
            const toggles = document.querySelectorAll('.collapsible-mobile > h4');
            const isMobile = () => window.innerWidth <= 768;
            const setCollapsibleState = () => toggles.forEach(t => { const p = t.parentElement, c = p.querySelector('.collapsible-content'); if (isMobile()) { p.classList.remove('expanded'); c.style.maxHeight = null; } else { p.classList.add('expanded'); c.style.maxHeight = null; } });
            toggles.forEach(t => t.addEventListener('click', () => { if (isMobile()) { const p = t.parentElement, c = p.querySelector('.collapsible-content'); p.classList.toggle('expanded'); c.style.maxHeight = p.classList.contains('expanded') ? c.scrollHeight + "px" : null; } }));
            window.addEventListener('resize', setCollapsibleState);
            setCollapsibleState();
        })();
    }

    function initializeAnimations() {
        (function initializeMarquees() {
            const { projects, skills } = portfolioData;
            let sHtml = '', tHtml = '', uHtml = '';
            skills.forEach(c => c.items.forEach(i => sHtml += `<div class="marquee-item">${createIconHtml(i.icon, i.name)}<span>${i.name}</span></div>`));
            document.getElementById('skills-marquee').innerHTML = `<div class="marquee-content" style="animation-duration: 60s;">${sHtml.repeat(2)}</div>`;
            const tProj = projects.find(p => p.title.includes("Support"));
            if (tProj?.useCases) { tProj.useCases.items.forEach(i => tHtml += `<div class="marquee-item"><span>${i.replace(/<[^>]*>/g, ' ')}</span></div>`); document.getElementById('trading-marquee').innerHTML = `<div class="marquee-content" style="animation-duration: 55s; animation-direction: reverse;">${tHtml.repeat(2)}</div>`; }
            const uProj = projects.find(p => p.title.includes("Trading"));
            if (uProj?.useCases) { uProj.useCases.items.forEach(i => uHtml += `<div class="marquee-item"><span>${i.replace(/<[^>]*>/g, ' ')}</span></div>`); document.getElementById('support-marquee').innerHTML = `<div class="marquee-content" style="animation-duration: 80s;">${uHtml.repeat(2)}</div>`; }
        })();
        
        (function initializeImageCarousels() {
            document.querySelectorAll('.image-carousel-container').forEach(c => { const s = c.querySelectorAll('.image-carousel-slide'); if (s.length > 1) { let i = 0; s[i].classList.add('active'); setInterval(() => { s[i].classList.remove('active'); i = (i + 1) % s.length; s[i].classList.add('active'); }, 4500); } });
        })();

        (function initializeStaggeredReveal() {
            const obs = new IntersectionObserver((e) => e.forEach(i => { if (i.isIntersecting) { i.target.classList.add('visible'); obs.unobserve(i.target); } }), { threshold: 0.05 });
            document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
        })();
        
        (function initializeBentoTilt() {
            document.querySelectorAll('#community .bento-item').forEach(i => {
                i.addEventListener('mousemove', e => { const r = i.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, rX = (y / r.height - 0.5) * -15, rY = (x / r.width - 0.5) * 15; i.style.transition = 'transform 0.1s ease-out'; i.style.transform = `translateY(-5px) scale(1.02) rotateX(${rX}deg) rotateY(${rY}deg)`; });
                i.addEventListener('mouseleave', () => { i.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'; i.style.transform = 'rotateX(0) rotateY(0)'; });
            });
        })();
        
        (function initializeScrollProgress() {
            const b = document.getElementById('scroll-progress-bar');
            window.addEventListener('scroll', () => { b.style.width = `${(window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100}%`; });
        })();
    }

    initializePage();
});
