class DisneyBitacora {
    constructor() {
        this.entries = JSON.parse(localStorage.getItem('disney_bitacora_entries')) || [
            {
                id: '101',
                title: 'La magia de los fuegos artificiales en el Castillo',
                topic: 'Parques',
                date: '2026-11-10',
                image: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&w=900&q=80',
                video: '',
                body: 'No hay nada comparable con ver el cielo iluminarse sobre el castillo mientras suena la banda sonora de las películas clásicas. Cada destello dorado recuerda que nunca dejamos de ser niños.'
            },
            {
                id: '102',
                title: 'Bandas sonoras inolvidables de Disney',
                topic: 'Música',
                date: '2026-11-12',
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
                video: 'https://www.youtube.com/watch?v=L0MK7qz13bU',
                body: 'Desde las melodías orquestales de Alan Menken hasta los éxitos modernos, la música siempre ha sido el corazón de cada historia animada. Aquí dejo uno de los momentos musicales más icónicos.'
            }
        ];

        this.currentFilter = 'Todos';
        this.searchQuery = '';
        this.currentView = 'home';
        this.tempVideoData = ''; // Almacena temporalmente el video cargado localmente
        this.init();
    }

    init() {
        this.renderTopics();
        this.renderEntries();
    }

    saveToStorage() {
        try {
            localStorage.setItem('disney_bitacora_entries', JSON.stringify(this.entries));
        } catch (e) {
            alert('El archivo de video es demasiado grande para guardarlo en la memoria del navegador. Te recomendamos usar videos cortos o comprimidos.');
        }
    }

    setView(view, id = null) {
        this.currentView = view;
        document.getElementById('view-home').classList.toggle('hidden', view !== 'home');
        document.getElementById('view-detail').classList.toggle('hidden', view !== 'detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (view === 'detail' && id) {
            this.renderDetail(id);
        } else {
            this.renderEntries();
        }
    }

    renderTopics() {
        const topics = ['Todos', ...new Set(this.entries.map(e => e.topic))];
        const container = document.getElementById('topics-filter');
        
        container.innerHTML = topics.map(topic => `
            <button onclick="app.filterByTopic('${topic}')" class="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                this.currentFilter === topic 
                ? 'bg-gradient-to-r from-amber-400 to-disney-gold text-disney-night shadow-md shadow-amber-500/25' 
                : 'bg-disney-deep/80 text-sky-200 border border-sky-400/25 hover:border-disney-gold/60'
            }">
                ${this.currentFilter === topic ? '<i class="fa-solid fa-star text-xs"></i>' : ''}
                <span>${topic}</span>
            </button>
        `).join('');
    }

    filterByTopic(topic) {
        this.currentFilter = topic;
        this.renderTopics();
        this.renderEntries();
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.renderEntries();
    }

    getFilteredEntries() {
        return this.entries.filter(entry => {
            const matchesTopic = this.currentFilter === 'Todos' || entry.topic === this.currentFilter;
            const matchesSearch = entry.title.toLowerCase().includes(this.searchQuery) || 
                                  entry.body.toLowerCase().includes(this.searchQuery);
            return matchesTopic && matchesSearch;
        });
    }

    renderEntries() {
        const grid = document.getElementById('entries-grid');
        const emptyState = document.getElementById('empty-state');
        const filtered = this.getFilteredEntries();

        if (filtered.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        grid.innerHTML = filtered.map(entry => `
            <div onclick="app.setView('detail', '${entry.id}')" class="magic-card rounded-3xl overflow-hidden cursor-pointer flex flex-col group">
                ${entry.image ? `
                    <div class="h-52 overflow-hidden bg-disney-night relative">
                        <img src="${entry.image}" alt="${entry.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-disney-deep via-transparent to-transparent opacity-80"></div>
                        ${entry.video ? `<span class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-disney-gold px-2.5 py-1 rounded-full text-xs border border-disney-gold/40"><i class="fa-solid fa-play mr-1"></i>Video</span>` : ''}
                    </div>
                ` : `
                    <div class="h-36 bg-gradient-to-br from-disney-royal/40 to-disney-night flex items-center justify-center text-disney-gold text-3xl">
                        <i class="fa-brands fa-fort-awesome"></i>
                    </div>
                `}
                <div class="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="px-3 py-1 bg-sky-500/15 border border-sky-400/30 text-sky-300 rounded-full text-xs font-semibold">
                                <i class="fa-solid fa-sparkles text-disney-gold mr-1 text-[10px]"></i>${entry.topic}
                            </span>
                            <span class="text-xs text-slate-400">${entry.date}</span>
                        </div>
                        <h3 class="font-bold text-white text-lg mb-2 group-hover:text-disney-gold transition-colors leading-snug">${entry.title}</h3>
                        <p class="text-sm text-slate-300 line-clamp-2">${entry.body}</p>
                    </div>
                    <div class="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-disney-gold">
                        <span>Abrir historia</span>
                        <i class="fa-solid fa-wand-magic-sparkles group-hover:translate-x-1 transition-transform"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderDetail(id) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;

        let videoEmbed = '';
        if (entry.video) {
            if (entry.video.includes('youtube.com') || entry.video.includes('youtu.be')) {
                const videoId = entry.video.split('v=')[1]?.split('&')[0] || entry.video.split('/').pop();
                videoEmbed = `
                    <div class="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-6 border border-disney-gold/30 shadow-xl">
                        <iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
            } else {
                // Reproductor nativo para videos locales subidos (.mp4, .webm, etc.)
                videoEmbed = `
                    <div class="mb-6 rounded-2xl overflow-hidden border border-disney-gold/30 shadow-xl bg-black">
                        <video src="${entry.video}" controls class="w-full max-h-[500px] mx-auto"></video>
                    </div>
                `;
            }
        }

        const container = document.getElementById('detail-content');
        container.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <span class="px-3.5 py-1 bg-sky-500/15 border border-sky-400/30 text-sky-300 rounded-full text-xs font-semibold">
                    <i class="fa-solid fa-sparkles text-disney-gold mr-1"></i>${entry.topic}
                </span>
                <div class="flex items-center space-x-2">
                    <span class="text-xs text-slate-400 mr-2">${entry.date}</span>
                    <button onclick="app.openModal('${entry.id}')" class="p-2 text-sky-300 hover:text-disney-gold rounded-full hover:bg-white/5 transition-colors" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="app.deleteEntry('${entry.id}')" class="p-2 text-sky-300 hover:text-rose-400 rounded-full hover:bg-white/5 transition-colors" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <h1 class="text-2xl sm:text-4xl font-fairy font-bold text-disney-goldLight mb-6 leading-tight">${entry.title}</h1>
            
            ${entry.image ? `
                <div class="mb-6 rounded-2xl overflow-hidden bg-disney-night max-h-[460px] border border-white/10">
                    <img src="${entry.image}" alt="${entry.title}" class="w-full h-full object-cover">
                </div>
            ` : ''}

            ${videoEmbed}

            <div class="text-slate-200 text-base leading-relaxed whitespace-pre-wrap mb-8">
                ${entry.body}
            </div>

            <div class="border-t border-white/10 pt-6 mt-8">
                <h4 class="text-xs font-bold uppercase tracking-widest text-disney-gold mb-4">
                    <i class="fa-solid fa-star mr-1"></i> Más historias en ${entry.topic}
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    ${this.entries.filter(e => e.topic === entry.topic && e.id !== entry.id).map(rel => `
                        <div onclick="app.setView('detail', '${rel.id}')" class="p-4 rounded-2xl border border-sky-400/20 hover:border-disney-gold cursor-pointer transition-all bg-disney-night/60">
                            <h5 class="font-semibold text-sm text-white line-clamp-1">${rel.title}</h5>
                            <span class="text-xs text-slate-400 mt-1 block">${rel.date}</span>
                        </div>
                    `).join('') || '<p class="text-sm text-slate-400 italic">Aún no hay otras historias en este mundo.</p>'}
                </div>
            </div>
        `;
    }

    openModal(id = null) {
        document.getElementById('entry-modal').classList.remove('hidden');
        this.tempVideoData = '';
        
        if (id) {
            const entry = this.entries.find(e => e.id === id);
            document.getElementById('modal-title').textContent = 'Editar Historia';
            document.getElementById('entry-id').value = entry.id;
            document.getElementById('entry-title').value = entry.title;
            document.getElementById('entry-topic').value = entry.topic;
            document.getElementById('entry-image').value = entry.image || '';
            document.getElementById('entry-video-url').value = entry.video && entry.video.startsWith('http') ? entry.video : '';
            document.getElementById('entry-body').value = entry.body;
            this.tempVideoData = entry.video && !entry.video.startsWith('http') ? entry.video : '';
        } else {
            document.getElementById('modal-title').textContent = 'Nueva Historia Mágica';
            document.getElementById('entry-form').reset();
            document.getElementById('entry-id').value = '';
        }
    }

    closeModal() {
        document.getElementById('entry-modal').classList.add('hidden');
    }

    handleVideoFile(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.tempVideoData = e.target.result;
                document.getElementById('entry-video-url').value = ''; // Limpia la URL si sube archivo local
            };
            reader.readAsDataURL(file);
        }
    }

    saveEntry(event) {
        event.preventDefault();
        const id = document.getElementById('entry-id').value;
        const title = document.getElementById('entry-title').value;
        const topic = document.getElementById('entry-topic').value.trim();
        const image = document.getElementById('entry-image').value;
        const videoUrl = document.getElementById('entry-video-url').value.trim();
        const body = document.getElementById('entry-body').value;
        const date = new Date().toISOString().split('T')[0];

        // Prioriza el video local cargado o la URL de YouTube introducida
        const finalVideo = this.tempVideoData || videoUrl;

        if (id) {
            const index = this.entries.findIndex(e => e.id === id);
            if (index !== -1) {
                this.entries[index] = { ...this.entries[index], title, topic, image, video: finalVideo, body };
            }
        } else {
            const newEntry = { id: Date.now().toString(), title, topic, image, video: finalVideo, body, date };
            this.entries.unshift(newEntry);
        }

        this.saveToStorage();
        this.closeModal();
        this.renderTopics();
        
        if (this.currentView === 'detail' && id) {
            this.renderDetail(id);
        } else {
            this.renderEntries();
        }
    }

    deleteEntry(id) {
        if (confirm('¿Deseas borrar esta historia del libro?')) {
            this.entries = this.entries.filter(e => e.id !== id);
            this.saveToStorage();
            this.setView('home');
            this.renderTopics();
        }
    }
}

const app = new DisneyBitacora();