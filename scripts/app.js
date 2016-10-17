// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function () {
        'use strict';


        /********************************************************
        /****** memory js **************************************
        /********************************************************/

        var imageslist = [{
            url: 'images/img01.jpg',
            title: ''
}, {
            url: 'images/img02.jpg',
            title: ''
}, {
            url: 'images/img03.jpg',
            title: ''
}, {
            url: 'images/img04.jpg',
            title: ''
}, {
            url: 'images/img05.jpg',
            title: ''
}, {
            url: 'images/img06.jpg',
            title: ''
}, {
            url: 'images/img07.jpg',
            title: ''
}, {
            url: 'images/img08.jpg',
            title: ''
}, {
            url: 'images/img09.jpg',
            title: ''
}, {
            url: 'images/img10.jpg',
            title: ''
}, {
            url: 'images/img11.jpg',
            title: ''
}, {
            url: 'images/img12.jpg',
            title: ''
}, {
            url: 'images/img13.jpg',
            title: ''
}, {
            url: 'images/img14.jpg',
            title: ''
}, {
            url: 'images/img15.jpg',
            title: ''
}, {
            url: 'images/img16.jpg',
            title: ''
}, {
            url: 'images/img18.jpg',
            title: ''
}, {
            url: 'images/img19.jpg',
            title: ''
}, {
            url: 'images/img20.jpg',
            title: ''
}, {
            url: 'images/img21.jpg',
            title: ''
}, {
            url: 'images/img22.jpg',
            title: ''
}, {
            url: 'images/img23.jpg',
            title: ''
}];
        var i;
        for (i = 0; i < imageslist.length; i++) {
            imageslist[i].id = i;
        }

        var AlbumItem = React.createClass({
            render: function () {
                return ( < div className = "box" > < div className = "tile" > < img className = "placeholder"
                    src = "images/espaceur.gif" / > < img className = "cover"
                    src = {
                        this.props.url
                    }
                    /></div > < /div >
                );
            }
        });

        var AlbumList = React.createClass({

            render: function () {
                var albumNodes = this.props.data.map(function (album) {
                    var classList = album.viewed ? ' view' : '';
                    classList += album.reveal ? ' reveal' : '';
                    classList += this.props.intro ? ' intro' : '';

                    return ( < a href = "#"
                        className = {
                            classList
                        }
                        key = {
                            Number(album.tileid)
                        }

                        onClick = {
                            album.reveal ? void(0) : this.props.onSelectAlbum.bind(null, album)
                        } >
                        <
                        AlbumItem title = {
                            album.title
                        }
                        url = {
                            album.url
                        }
                        id = {
                            Number(album.id)
                        }
                        /></a >
                    );
                }.bind(this));
                return ( < div className = "albumList" > {
                    albumNodes
                } < div className = "clear" > < /div>< /div > );
            }
        });

        var HeaderPart = React.createClass({
            render: function () {
                return ( <
                    div className = "header" >
                    <
                    h1 className = "header__title" > React Memory PWA < /h1>  <
                    button id = "butRefresh"
                    className = "headerButton"

                    onClick = {
                        this.props.onResetGame.bind(null, this)
                    }
                    /> < /
                    div >
                );
            }
        });

        var FooterPart = React.createClass({
            render: function () {
                return ( <
                    div className = "footer" >
                    <
                    h1 className = "footer__title" > Click: {
                        this.props.scoreGame
                    } < /h1>  
                        <div className={this.props.endGame?'':'loaderhide'}> Fin de partie </div>
                        
                        < /
                    div >
                );
            }
        });

        var LoaderIcon = React.createClass({
            render: function () {

                var classList = 'loader';
                classList += !this.props.isLoading ? ' loaderhide' : '';

                return ( < div className = {
                        classList
                    } >
                    <
                    svg height = {
                        32
                    }
                    width = {
                        32
                    }
                    viewBox = "0 0 32 32" >
                    <
                    circle fill = "none"
                    r = {
                        14
                    }
                    cy = {
                        16
                    }
                    cx = {
                        16
                    }
                    id = "spinner" / >
                    <
                    /svg> < /
                    div >
                );
            }
        });

        var AlbumGrid = React.createClass({
            
            app: {
                inAnim: 1
            },
            
            initialgamestate: {
                intro: 1,
                score: 0,
                finJeu: 0,
                nbTile: 36
            },

            initGame: function () {
                console.log('game initialising');
                var gamestate = this.initialgamestate;

                this.setState({
                    game: gamestate
                });
                //sauvegarde de l'état du jeu
                var gamestatesave = JSON.stringify(this.state);
                localStorage.gamestate = gamestatesave;

                setTimeout(this.inAnimOff, 2000);
                //make new grid
                this.displayAlbumList();
            },

            loadGame: function () {

                //localStorage.clear();
                //console.log('game status : '+localStorage.gamestate);
                if (localStorage.gamestate) {
                    //load des datas and launch game if data
                    console.log('game loading');
                    var gamestatesave = JSON.parse(localStorage.gamestate);

                    if (gamestatesave.data.length) {
                        this.setState(gamestatesave);
                        setTimeout(this.inAnimOff, 2000);
                    } else {
                        //init game
                        this.initGame();
                    }

                } else {
                    //init game
                    this.initGame();
                }
            },

            displayAlbumList: function () {
                var imagesSet = imageslist;
                //mélange des pochettes
                imagesSet.sort(function () {
                    return 0.5 - Math.random()
                });
                //pris des 8 premières pochettes
                var tmpData = [];
                for (i = 0; i < (this.state.game.nbTile / 2); i++) {
                    /*tmpData.push(Object.create(imagesSet[i]));
                    tmpData.push(Object.create(imagesSet[i]));*/

                    tmpData.push({
                        title: imagesSet[i].title,
                        url: imagesSet[i].url,
                        id: imagesSet[i].id
                    });
                    tmpData.push({
                        title: imagesSet[i].title,
                        url: imagesSet[i].url,
                        id: imagesSet[i].id
                    });
                }
                //création des id
                for (i = 0; i < tmpData.length; i++) {
                    tmpData[i].tileid = i;
                    tmpData[i].viewed = 0;
                    tmpData[i].reveal = 0;
                }
                //melange des 8 pochettes
                tmpData.sort(function () {
                    return 0.5 - Math.random()
                });

                this.setState({
                    data: tmpData
                });
                //sauvegarde de l'état du jeu
                var gamestatesave = JSON.stringify(this.state);
                localStorage.gamestate = gamestatesave;
            },
            getInitialState: function () {
                return {
                    isLoading: true,
                    game: this.initialgamestate,
                    data: [],
                    checked: []
                };
            },
            componentDidMount: function () {
                this.loadGame();

                this.setState({
                    isLoading: false
                });
                //sauvegarde de l'état du jeu
                var gamestatesave = JSON.stringify(this.state);
                localStorage.gamestate = gamestatesave;
            },

            onSelectAlbum: function (album) {
                var gamestate = this.state.game;
                if (!this.app.inanim) {
                    var checkedstate = this.state.checked;
                    album.viewed = 1;
                    checkedstate.push(album);
                    if (checkedstate.length > 1) {
                        setTimeout(this.checkIdentity, 700);
                        this.app.inanim = 1;
                    }

                    gamestate.score++;
                    gamestate.intro = 0;

                    this.setState({
                        game: gamestate,
                        checked: checkedstate
                    });
                    //sauvegarde de l'état du jeu
                    var gamestatesave = JSON.stringify(this.state);
                    localStorage.gamestate = gamestatesave;
                }
            },

            checkIdentity: function () {
                var gamestate = this.state.game;
                var checkedstate = this.state.checked;
                //test d'indenticité !
                if (checkedstate[0].id == checkedstate[1].id) {
                    checkedstate[0].viewed = 0;
                    checkedstate[0].reveal = 1;
                    checkedstate[1].viewed = 0;
                    checkedstate[1].reveal = 1;
                    checkedstate = [];
                } else {
                    checkedstate[0].viewed = 0;
                    checkedstate[1].viewed = 0;
                    checkedstate = [];
                }
                //test fin jeu
                var data = this.state.data;
                gamestate.finJeu = 1;
                for (i in data) {
                    if (data[i].reveal == 0) {
                        gamestate.finJeu = 0;
                        break;
                    }
                }

                this.app.inanim = 0;

                this.setState({
                    game: gamestate,
                    checked: checkedstate
                });
                //sauvegarde de l'état du jeu
                var gamestatesave = JSON.stringify(this.state);
                localStorage.gamestate = gamestatesave;
            },

            inAnimOff: function () {
                var gamestate = this.state.game;
                this.app.inanim = 0;
                this.setState({
                    game: gamestate
                });
                //sauvegarde de l'état du jeu
                var gamestatesave = JSON.stringify(this.state);
                localStorage.gamestate = gamestatesave;
            },

            render: function () {
                var gamestate = this.state.game;
                var classList = "score";
                classList += gamestate.finJeu ? ' fin' : '';

                var boxWidth = 100 / Math.sqrt(gamestate.nbTile) + '%';
                return ( < div >
                    <
                    style dangerouslySetInnerHTML = {
                        {
                            __html: "\n.box{\nwidth:" + boxWidth + ";\n}\n"
                        }
                    }
                    />

                    <
                    HeaderPart onResetGame = {
                        this.initGame
                    }
                    / >

                    <
                    AlbumList data = {
                        this.state.data
                    }
                    onSelectAlbum = {
                        this.onSelectAlbum
                    }
                    intro = {
                        gamestate.intro
                    }
                    /> <
                    FooterPart endGame = {
                        gamestate.finJeu
                    }
                    scoreGame = {
                        gamestate.score
                    }

                    /> <
                    LoaderIcon isLoading = {
                        this.state.isLoading
                    }
                    />

                    <
                    /div >
                );
            }
        });

        ReactDOM.render( < AlbumGrid pollInterval = {
                4000
            }
            />, document.getElementById('container'));



            /* code to cache the app on local */

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker
                    .register('./service-worker.js')
                    .then(function () {
                        console.log('Service Worker registered');
                    });
            }

        })();
