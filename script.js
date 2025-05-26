
// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const searchInput = document.getElementById('searchInput');
const sourceCodeBtn = document.getElementById('sourceCodeBtn');
const contactMeBtn = document.getElementById('contactMeBtn');
const endpointSections = document.getElementById('endpointSections');

// Sidebar functionality
function toggleSidebar() {
  sidebar.classList.toggle('open');
}

// Mobile menu toggle
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', toggleSidebar);
}

// Sidebar toggle
if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
}

// Navigation sections
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const section = item.closest('.nav-section');
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(navItem => {
      navItem.classList.remove('active');
    });
    
    // Add active class to clicked item
    item.classList.add('active');
    
    // Toggle expanded state
    section.classList.toggle('expanded');
    
    // Close other sections
    document.querySelectorAll('.nav-section').forEach(otherSection => {
      if (otherSection !== section) {
        otherSection.classList.remove('expanded');
      }
    });
  });
});

// Counter animation for stats
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      
      // Trigger counter animation when stats section is visible
      if (entry.target.classList.contains('stats-dashboard')) {
        setTimeout(animateCounters, 300);
      }
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stat-card, .hero-content > *').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});

// Search functionality
let searchTimeout;
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase();
      filterEndpoints(query);
    }, 300);
  });
}

function filterEndpoints(query) {
  const navItems = document.querySelectorAll('.nav-item, .nav-subitem');
  
  navItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    const isMatch = text.includes(query);
    
    item.style.display = isMatch || query === '' ? 'flex' : 'none';
    
    if (item.classList.contains('nav-subitem')) {
      item.style.display = isMatch || query === '' ? 'block' : 'none';
    }
  });
}

// Button click handlers
if (sourceCodeBtn) {
  sourceCodeBtn.addEventListener('click', () => {
    // Add click effect
    sourceCodeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      sourceCodeBtn.style.transform = '';
    }, 150);
    
    // Simulate opening source code
    window.open('https://github.com/wataru-api', '_blank');
  });
}

if (contactMeBtn) {
  contactMeBtn.addEventListener('click', () => {
    // Add click effect
    contactMeBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      contactMeBtn.style.transform = '';
    }, 150);
    
    // Simulate contact action
    window.open('mailto:contact@wataru-api.dev', '_blank');
  });
}

// Generate endpoint documentation
function generateEndpointDocumentation() {
  const endpoints = [
    {
      category: 'AI',
      icon: '🤖',
      color: 'blue',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/ai/chat',
          description: 'Generate AI chat completions',
          parameters: ['message', 'model', 'temperature'],
          example: `{
  "message": "Hello, how are you?",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7
}`
        }
      ]
    },
    {
      category: 'Anime',
      icon: '🎌',
      color: 'purple',
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/anime/search',
          description: 'Search for anime by title',
          parameters: ['q', 'limit', 'page'],
          example: `{
  "q": "Attack on Titan",
  "limit": 10,
  "page": 1
}`
        },
        {
          method: 'GET',
          path: '/api/v1/anime/{id}',
          description: 'Get detailed anime information',
          parameters: ['id'],
          example: '{ "id": "16498" }'
        }
      ]
    },
    {
      category: 'Downloader',
      icon: '⬇️',
      color: 'green',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/download/video',
          description: 'Download video from URL',
          parameters: ['url', 'quality', 'format'],
          example: `{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "quality": "720p",
  "format": "mp4"
}`
        }
      ]
    }
  ];

  const sectionsHTML = endpoints.map(category => `
    <div class="endpoint-category">
      <div class="category-header">
        <div class="category-icon ${category.color}">
          ${category.icon}
        </div>
        <h3 class="category-title">${category.category}</h3>
        <span class="category-count">${category.endpoints.length} endpoint${category.endpoints.length > 1 ? 's' : ''}</span>
      </div>
      <div class="endpoints-list">
        ${category.endpoints.map(endpoint => `
          <div class="endpoint-card">
            <div class="endpoint-header">
              <span class="method-badge ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
              <code class="endpoint-path">${endpoint.path}</code>
            </div>
            <p class="endpoint-description">${endpoint.description}</p>
            <div class="endpoint-details">
              <div class="parameters">
                <h4>Parameters:</h4>
                <div class="parameter-list">
                  ${endpoint.parameters.map(param => `<span class="parameter">${param}</span>`).join('')}
                </div>
              </div>
              <div class="example">
                <h4>Example:</h4>
                <pre class="code-block"><code>${endpoint.example}</code></pre>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  if (endpointSections) {
    endpointSections.innerHTML = sectionsHTML;
  }
}

// Add endpoint documentation styles
const endpointStyles = `
  .endpoint-category {
    margin-bottom: 3rem;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-primary);
  }

  .category-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .category-icon.blue { background: linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(0, 217, 255, 0.1)); }
  .category-icon.purple { background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1)); }
  .category-icon.green { background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)); }

  .category-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
  }

  .category-count {
    background: var(--bg-glass);
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
  }

  .endpoints-list {
    display: grid;
    gap: 1.5rem;
  }

  .endpoint-card {
    background: var(--bg-card);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-primary);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .endpoint-card:hover {
    border-color: var(--accent-blue);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 217, 255, 0.1);
  }

  .endpoint-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .method-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    font-family: var(--font-mono);
    text-transform: uppercase;
  }

  .method-badge.get { background: rgba(16, 185, 129, 0.2); color: var(--accent-green); }
  .method-badge.post { background: rgba(245, 158, 11, 0.2); color: var(--accent-orange); }
  .method-badge.put { background: rgba(6, 182, 212, 0.2); color: var(--accent-cyan); }
  .method-badge.delete { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

  .endpoint-path {
    font-family: var(--font-mono);
    background: var(--bg-glass);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-primary);
    color: var(--accent-blue);
  }

  .endpoint-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .endpoint-details {
    display: grid;
    gap: 1rem;
  }

  .endpoint-details h4 {
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .parameter-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .parameter {
    background: var(--bg-glass);
    color: var(--accent-purple);
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-family: var(--font-mono);
  }

  .code-block {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    margin: 0;
  }

  .code-block code {
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .endpoint-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .category-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = endpointStyles;
document.head.appendChild(styleSheet);

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-subitem').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Particle effect for hero section
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: var(--accent-blue);
      border-radius: 50%;
      opacity: 0.6;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${5 + Math.random() * 10}s linear infinite;
    `;
    hero.appendChild(particle);
  }
}

// Add particle animation
const particleAnimation = `
  @keyframes float {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
  }
`;

const particleStyle = document.createElement('style');
particleStyle.textContent = particleAnimation;
document.head.appendChild(particleStyle);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  // Generate endpoint documentation
  generateEndpointDocumentation();
  
  // Create particles
  createParticles();
  
  // Initialize observers
  observer.observe(document.querySelector('.stats-dashboard'));
  
  // Add loading animation to stats initially
  document.querySelectorAll('.stat-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
  
  console.log('Wataru API Documentation loaded successfully! 🚀');
});

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    sidebar.classList.remove('open');
  }
});

// Add scroll effect to header
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  
  lastScrollY = currentScrollY;
});

// Add typing effect to hero subtitle
function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect after page load
setTimeout(() => {
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    const originalText = subtitle.textContent;
    typeWriter(subtitle, originalText, 30);
  }
}, 1000);
