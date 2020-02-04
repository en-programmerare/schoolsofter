        var url;
        if(typeof(Storage) !== undefined) {
            var lank = localStorage.getItem("lank");
            if(lank === null) {
                nyLank();
            }
            else {
                url = localStorage.getItem("lank");
                las();
            }
        }
        //EventListeners alla knappar
        document.getElementById("redlnkknp").addEventListener("click", raderaLank);
        document.getElementById("anvandLank").addEventListener("click", function() {
            localStorage.setItem("lank", document.getElementById("adress").value);
            url = localStorage.getItem("lank");
            document.getElementById("vantar").style.display = "block";
            document.getElementById("lank").style.display = "none";
            las();
        });
        document.getElementById("nyLank").addEventListener("click", raderaLank);
        document.getElementById("laddaOm").addEventListener("click", laddaOm);
        
        //Läser RSS från URL och visar schemat
        function las() {
            //Skapar Prototype-funktioner i nödvändiga Javascript-klasser
            Date.prototype.getWeek = function() {
                var onejan = new Date(this.getFullYear(),0,1);
                return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
            }
            String.prototype.aao = function() {
                return this.replace(/Ã¥/g, "å").replace(/Ã¤/g, "ä").replace(/Ã¶/g, "ö");
            }
            
            //Skapar cellernas ID och veckonr
            var nu = new Date();
            for(var i = nu.getWeek(); i < nu.getWeek() + 5; i++) {
                var nasta = "<tr><td>" + i + "</td><td id='m" + i + "'></td><td id='t" + i + "'></td><td id='o" + i + "'></td><td id='T" + i + "'></td><td id='f" + i + "'></td></tr>";
                document.getElementById("laxschema").innerHTML = document.getElementById("laxschema").innerHTML + nasta;
            }
            
            //Ifall det blir fel
            var timeout = setTimeout(lasningsFel, 5000);
            
            //Läs
            var dag;
            var vecka;
            feednami.load(url)
            .then(feed => {
                console.log(feed);
                clearTimeout(timeout);
                document.getElementById("vantar").style.display = "none";
                document.getElementById("laxor").style.display = "block";
                for(let entry of feed.entries) {
                    entry.title = entry.title.aao();
                    //Skapar ett DIV-element att modifiera och skapa rutan i
                    var nasta = document.createElement("DIV");
                    nasta.title = "Klicka för mer information";
                    
                    //Om en läxa
                    if(entry.title.includes("Homework") || entry.title.includes("Hemläxa")) {
                        nasta.classList.add("laxa");
                        nasta.id = entry.guid;
                        nasta.innerHTML = "<output class='fet'>" + riktigRubrik(entry.title) + "</output><br>" + riktigBeskrivning(entry.description);
                        document.getElementById(cellId(entry.title)).appendChild(nasta);
                        document.getElementById(entry.guid).addEventListener("click", function() {
                            document.getElementById("rubrik").innerHTML = riktigRubrik(entry.title);
                            document.getElementById("besk").innerHTML = riktigBeskrivning(entry.description);
                            document.getElementById("typ").innerHTML = "Läxa";
                        });
                    }
                    
                    //Om ett prov
                    if(entry.title.includes("Assessment") || entry.title.includes("Prov")) {
                        nasta.classList.add("prov");
                        nasta.id = entry.guid;
                        nasta.innerHTML = "<output class='fet'>" + riktigRubrik(entry.title) + "</output><br>" + riktigBeskrivning(entry.description);
                        document.getElementById(cellId(entry.title)).appendChild(nasta);
                        document.getElementById(entry.guid).addEventListener("click", function() {
                            document.getElementById("rubrik").innerHTML = riktigRubrik(entry.title);
                            document.getElementById("besk").innerHTML = riktigBeskrivning(entry.description);
                            document.getElementById("typ").innerHTML = "Prov";
                        });
                    }
                    
                    //Om checkpoint
                    if(entry.title.includes("Checkpoint")) {
                        nasta.classList.add("check");
                        nasta.id = entry.guid;
                        nasta.innerHTML = "<output class='fet'>" + riktigRubrik(entry.title) + "</output><br>" + riktigBeskrivning(entry.description);
                        document.getElementById(cellId(entry.title)).appendChild(nasta);
                        document.getElementById(entry.guid).addEventListener("click", function() {
                            document.getElementById("rubrik").innerHTML = riktigRubrik(entry.title);
                            document.getElementById("besk").innerHTML = riktigBeskrivning(entry.description);
                            document.getElementById("typ").innerHTML = "Checkpoint";
                        });
                    }  
                }
            });
        }
        
        //Hittar cell-id numret (tex m6, T3) från Schoolsofts titel på RSS-item
        function cellId(rubrik) {
            var dag = "?";
            var vecka;
            vecka = rubrik.charAt(rubrik.lastIndexOf("v") + 1, rubrik.length - 12);
            if(rubrik.charAt(rubrik.indexOf(":") + 2) === 'M') {
                dag = "m";
            }
            if(rubrik.charAt(rubrik.indexOf(":") + 2) === 'W' || rubrik.charAt(rubrik.indexOf(":") + 2) === 'O') {
                dag = "o";
            }
            if(rubrik.charAt(rubrik.indexOf(":") + 2) === 'F') {
                dag = "f";
            }
            if(rubrik.charAt(rubrik.indexOf(":") + 2) === 'T') {
                if(rubrik.charAt(rubrik.indexOf(":") + 3) === 'u' || rubrik.charAt(rubrik.indexOf(":") + 3) === 'i') {
                    dag = "t";
                }
                else {
                    dag = "T";
                }
            }
            
            //Saknas cellen?
            if(document.getElementById(dag + vecka) === null) {
                return extra;
            }
            return dag + vecka;
        }
        
        //Stiliserar rubriken (ÅÄÖ-korrigeringar behöver ej genomföras, det görs i funktionen läs)
        function riktigRubrik(rubrik) {
            return rubrik.substring(rubrik.indexOf(" "), rubrik.lastIndexOf("v", rubrik.length - 12));
        }
        
        //Stiliserar beskrivningar
        function riktigBeskrivning(beskrivning) {
            beskrivning = beskrivning.aao();
            beskrivning = beskrivning.replace(/\<br\s\/\>/g, " ");
            beskrivning = beskrivning.substring(beskrivning.indexOf(">") + 1, beskrivning.lastIndexOf("<"));
            if(beskrivning === "") {
                beskrivning = "Ingen beskrivning";
            }
            return beskrivning;
        }
        
        //Oanvänd tillsvidare
        function visa(rubrik, beskrivning, typ) {
            document.getElementById("rubrik").innerHTML = rubrik;
            document.getElementById("besk").innerHTML = beskrivning;
            document.getElementById("typ").innerHTML = typ;
        }
        
        //Visar UI för att spara en ny länk
        function nyLank() {
            document.getElementById("vantar").style.display = "none";
            document.getElementById("laxor").style.display = "none";
            document.getElementById("fel").style.display = "none";
            document.getElementById("lank").style.display = "block";
            if(localStorage.getItem("lank") !== null) {
                document.getElementById("adress").value = localStorage.getItem("lank");
            }
        }
        
        //Visar UI om läsningsfel
        function lasningsFel() {
            document.getElementById("vantar").style.display = "none";
            document.getElementById("fel").style.display = "block";
        }
        
        //Raderar den gamla länken och visar UI om ett göra en ny
        function raderaLank() {
            localStorage.removeItem("lank");
            laddaOm();
        }
        
        //Laddar om
        function laddaOm() {
            window.location.reload();
        }
