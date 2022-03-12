
const VALUE_STORAGE = "Player";

const $ =  document.querySelector.bind(document);
const $$  = document.querySelectorAll.bind(document);
const playList = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const radomBtn = $('.btn-random');
const repeat = $('.btn-repeat');


const app = {
    config: JSON.parse(localStorage.getItem(VALUE_STORAGE)) || {},
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(VALUE_STORAGE, JSON.stringify(this.config));
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        repeat.classList.toggle('active', this.isRepeat);
        radomBtn.classList.toggle('active', this.isRandom);
    },

    songs : [
        { 
            name : "Song 1",
            singer: 'Anchor 1',
            path: './music/song1.mp3',
            image :'./image/anh1.jpg'
        },
        { 
            name : "Song 2",
            singer: 'Anchor 2',
            path: './music/song2.mp3',
            image :'./image/anh2.jpg'
        },
        { 
            name : "Song 3",
            singer: 'Anchor 3',
            path: './music/song3.mp3',
            image :'./image/anh3.jpg'
        },
        { 
            name : "Song 4",
            singer: 'Anchor 4',
            path: './music/song4.mp3',
            image :'./image/anh4.jpg'
        },
        { 
            name : "Song 5",
            singer: 'Anchor 5',
            path: './music/song5.mp3',
            image :'./image/anh5.jpg'
        },
        { 
            name : "Song 6",
            singer: 'Anchor 6',
            path: './music/song6.mp3',
            image :'./image/anh6.jpg'
        },
        { 
            name : "Song 7",
            singer: 'Anchor 7',
            path: './music/song7.mp3',
            image :'./image/anh7.jpg'
        },
        { 
            name : "Song 8",
            singer: 'Anchor 8',
            path: './music/song8.mp3',
            image :'./image/anh8.jpg'
        },
        { 
            name : "Song 9",
            singer: 'Anchor 9',
            path: './music/song9.mp3',
            image :'./image/anh9.jpg'
        }
    ],
    render : function(){
       const htmls = this.songs.map((song, index) => 
        {
        return `
            <div data-index = "${index}" class = "song ${(index === this.currentIndex) ? 'active' : ''}">
                <div class = "thumb"
                    style= "background-image: url('${song.image}')")>
                </div>
                <div class = "body">
                    <h3 class = "title"> ${song.name} </h3>
                    <p class = "author"> ${song.singer}</p>
                </div>
                <div class = "option">
                    <i class = "fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        }
        )
        playList.innerHTML = htmls.join('');//because map return array
    },

    handleEvents : function(){
        const _this = this;
        //when scrolling
        const cdWith = cd.offsetWidth;
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWith - scrollTop;//when pulling too fast, newCdWidth to negative and not working
            cd.style.width = (newCdWidth > 0) ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWith;
        }

        const playCD = cdThumb.animate([
            { transform : 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        playCD.pause();
        //when click play
        playBtn.onclick = function(){
            /*c1
            if(_this.isPlaying)
            {
            audio.play();
            player.classList.add('playing');
            _this.isPlaying= false;
            }else{
                audio.pause();
                player.classList.remove('playing');
                _this.isPlaying= true;
            }*/
            //c2

            (_this.isPlaying) ? audio.pause() : audio.play();

        }

        audio.onplay = function(){
            player.classList.add('playing');
            _this.isPlaying = true;//Takes true when audio is playing
            playCD.play();
        }

        audio.onpause = function (){
            player.classList.remove('playing');
            _this.isPlaying =  false;
            playCD.pause();
        }

        audio.ontimeupdate = function (){
            //define audio.duration = NaN
            if(audio.duration) {
                const progressPercent = audio.currentTime / audio.duration *100;
                progress.value = progressPercent;
            }
        }

        audio.onended = function (){
            if(_this.isRepeat) {
                audio.load();
            }
            else nextBtn.click();
        }

        //Fast forward processing
        progress.onchange = function(e){
            audio.currentTime = e.target.value * audio.duration / 100;
        }

        nextBtn.onclick = function(){
            (_this.isRandom) ? _this.playRandomSong() : _this.nextSong();
            audio.play();
            _this.render();//---------------
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function() {
            (_this.isRandom) ? _this.playRandomSong() : _this.prevSong();
            audio.play();
        }

        radomBtn.onclick = function(){
            (_this.isRandom) ? _this.isRandom = false : _this.isRandom = true;
            radomBtn.classList.toggle('active', _this.isRandom);
            _this.setConfig('isRandom', _this.isRandom);
        }

        repeat.onclick = function(){
            (_this.isRepeat) ? _this.isRepeat = false : _this.isRepeat = true;
            repeat.classList.toggle('active', _this.isRepeat);
            _this.setConfig('isRepeat', _this.isRepeat);
        }

        //listen to click behavior and playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');

            if(songNode || e.target.closest('.option')){

                if(songNode){
                _this.currentIndex = Number(songNode.dataset.index);
                console.log(_this.currentIndex);
                _this.loadCurrentSong();
                audio.play();
                _this.render();
                }

                // when clicking ...
                if(a.target.closest('.option')){


                }
            }
        }
    },

    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        },300)
    },

    playRandomSong: function(){
        let indexRandom; 
        do {
            indexRandom = Math.floor(Math.random()*this.songs.length);
        } while (indexRandom === this.currentIndex);

        this.currentIndex = indexRandom;
        this.loadCurrentSong();
    },


    defineProperties : function(){
        Object.defineProperty(this, 'currentSong',{
            get : function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong : function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')` ;
        audio.src = this.currentSong.path;
    },

    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        this.loadCurrentSong();
    },

    start: function(){

        this.loadConfig();
        //Define properties for the object
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}

app.start();

