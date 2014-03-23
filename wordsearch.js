(function($){
	
	
	var LetterBox = function(letter, x, y){
		var self = this;
		this.letter = letter;
		this.x = x;
		this.y = y;
		this.w;
		this.h;
		this.blockFill = "#000";
		this.letterFill = "#fff";
		this.size = 30;
		
		
		this.getPosX = function(){
			return (self.x * self.size) + 2;
		};
		
		this.getPosY = function(){
			return (self.y * self.size) + 2;
		};
		
		this.getBounds = function(){
			return {
				x1: self.getPosX(),
				y1: self.getPosY(),
				x2: self.getPosX() + self.size - 2,
				y2: self.getPosY() + self.size - 2
			}
		};
		
		this.getLetterX = function(){
			return (self.x * self.size) + 15;
		};
		this.getLetterY = function(){
			return (self.y * self.size) + 22;
		};
		
	};
	
	
	
	var WordSearch = function(){
		this.canvas = null;
		this.ctx = null;
		this.words = [];
		
		this.grid = [];
		this.x_slots = 0;
		this.y_slots = 0;
		this.blockSize = 30;
		
		this.alphabet = ["A","B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
		
		this.interact = {
			capturing: false,
			startPos: false,
			currentPos: false,
			endPos: false
		};
	};
	
	
	WordSearch.prototype.fillRandomLetters = function(){
		for (var i=0; i<this.x_slots; i++){
			for (var j=0; j<this.y_slots; j++){
				if (this.grid[i][j] === false){
					var letterIndex = Math.floor((Math.random() * this.alphabet.length));
					var letter = this.alphabet[letterIndex];
					this.grid[i][j] = new LetterBox(letter, i, j);
				}
			}
		}
		
	};
	
	WordSearch.prototype.fillLetterWords = function(){		
		for (var i=0; i<this.words.length; i++){
			var word = this.words[i];
			
			do {
				var available = true;
				var vertical = Math.random() < 0.5;
				var x = Math.floor(Math.random() * (this.x_slots - word.length ));
				var y = Math.floor(Math.random() * (this.y_slots - word.length ));

				for (var j=0; j<word.length; j++){
					if (vertical){
						if (this.grid[x+j][y] !== false){
							available = false;
						}
					} else {
						if (this.grid[x][y+j] !== false){
							available = false;
						}
					}
				}
			} while (!available);
			
			
			
			for (var j=0; j<word.length; j++){
				if (vertical){
					var letterBox = new LetterBox(word.charAt(j).toUpperCase(), x+j, y);	
					letterBox.letterFill = "yellow";
					this.grid[x+j][y] = letterBox;
				} else {
					var letterBox = new LetterBox(word.charAt(j).toUpperCase(), x, y+j);
					letterBox.letterFill = "yellow";
					this.grid[x][y+j] = letterBox;
				}

			}
		}
		
	};
	
	WordSearch.prototype.isSelected = function(item){
		if (!this.interact.capturing) return false;

		var start = this.interact.startPos;
		var end = this.interact.currentPos;



		// VERTICAL
		if (start.x == end.x){
			if (item.x == start.x){
				
				if (end.y >= start.y){
					// down
					
					if (item.y >= start.y && item.y <= end.y){
						return true;
					}
					
				} else if (end.y < start.y){
					// up
					
					if (item.y <= start.y && item.y >= end.y){
						return true;
					}
				}
			}
		} 
		// HORIZONTAL
		else if (start.y == end.y){
			if (item.y == start.y){
				if (end.x >= start.x){
					// right
					if (item.x >= start.x && item.x <= end.x){
						return true;
					}
				} else if (end.x < start.x){
					// left
					if (item.x <= start.x && item.x >= end.x){
						return true;
					}
				}
			}
		}
		
		return false;
	}
	
	WordSearch.prototype.fillLetters = function(){
		this.ctx.textAlign="center"; 
		this.ctx.font = "22px Arial light";
		for (var i=0; i<this.grid.length; i++){
			for (var j=0; j<this.grid[i].length; j++){
				var letterBox = this.grid[i][j];

				if (this.isSelected(letterBox)){
					this.ctx.fillStyle = 'red';
				} else {
					this.ctx.fillStyle = letterBox.blockFill;					
				}

				this.ctx.fillRect(letterBox.getPosX(), letterBox.getPosY(), letterBox.size-2, letterBox.size-2);
				this.ctx.fillStyle = letterBox.letterFill;
				this.ctx.fillText(letterBox.letter, letterBox.getLetterX(), letterBox.getLetterY());
			}
		}
	};
	
	WordSearch.prototype.draw = function(){
		var self = this;
		this.fillLetters();
		
		
		setTimeout(function(){
			self.draw();
		}, 30);
	};
	
	WordSearch.prototype.checkWordSelection = function(){
		var start = this.interact.startPos,
			end = this.interact.endPos;
		
		
		var letters = [];
		if (start.x == end.x){
			// vertical
			var x = start.x;
			if (start.y > end.y){
				for (var y = end.y; y<= start.y; y++){
					letters.push(this.grid[x][y]);
				}
			} else {
				for (var y = start.y; y<= end.y; y++){
					letters.push(this.grid[x][y]);
				}
			}
			
		} else if (start.y == end.y){
			// horizontal
			var y = start.y;
			if (start.x > end.x){
				for (var x = end.x; x<= start.x; x++){
					letters.push(this.grid[x][y]);
				}
			} else {
				for (var x = start.x; x <= end.x; x++){
					letters.push(this.grid[x][y]);
				}
			}
		}
		
		for (var i=0; i<letters.length; i++){
			console.log(letters[i].letter);
		}
		
		
		for (var i=0; i<this.words.length; i++){
			var word = this.words[i];
			if (word.length == letters.length){

				var match = true;
				console.log("Comparing ", word);
				for (var j=0; j<letters.length; j++){
					console.log(letters[j].letter, word.charAt(j).toUpperCase());
					if (letters[j].letter != word.charAt(j).toUpperCase()){
						match = false;
					}
				}
				if (match == true){
					for (var i=0; i<letters.length; i++){
						letters[i].blockFill = 'green';
					}
					return;
				}
			}
			
		}
		
		
	};
	
	WordSearch.prototype.events = function(){
		var self = this, 
			capturing = false,
			startPos = false, 
			currentPos = false,
			endPos = false;
		
		
		
		var mouseDown = function(e, canvas){
			self.interact.capturing = true;
			console.log({ x: e.offsetX, y: e.offsetY });
			
			self.interact.startPos = {
				x: Math.floor(e.offsetX / self.blockSize),
				y: Math.floor(e.offsetY / self.blockSize)
			};
		};
		
		var mouseUp = function(e, canvas){
			self.interact.capturing = false;
			self.interact.endPos = {
				x: Math.floor(e.offsetX / self.blockSize),
				y: Math.floor(e.offsetY / self.blockSize)
			};
			self.checkWordSelection();
			self.interact.startPos = false;
			self.interact.endPos = false;
		};
		
		var mouseMove = function(e, canvas){
			if (self.interact.capturing){
				self.interact.currentPos = {
					x: Math.floor(e.offsetX / self.blockSize),
					y: Math.floor(e.offsetY / self.blockSize)
				};
			}
		};
		this.canvas.addEventListener("mousedown", mouseDown, false);
		this.canvas.addEventListener("mouseup", mouseUp, false);
		this.canvas.addEventListener("mousemove", mouseMove, false);
		
	};
	
	WordSearch.prototype.init = function(){
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.words = [
			"Gabrielle",
			"Lisa",
			"Billy",
			"Nelly",
			"Baby",
			"Gator",
			"Boo"
		];
		
		
		
		this.x_slots = Math.floor(this.canvas.width / this.blockSize);
		this.y_slots = Math.floor(this.canvas.height / this.blockSize);
		
		
		for (var i=0; i<this.x_slots; i++){
			this.grid[i] = [];
			for (var j=0; j<this.y_slots; j++){
				//this.ctx.fillStyle = "#000";
				//this.ctx.fillRect((i*this.blockSize)+2, (j*this.blockSize)+2, this.blockSize-2, this.blockSize-2);
				
				this.grid[i][j] = false;
			}
		}
		
		this.events();
		this.fillLetterWords();
		this.fillRandomLetters();
		this.fillLetters();
		this.draw();
	};
	
	
	$(window).load(function(){
		var WS = new WordSearch();
		window.WS = WS;
		WS.init();
	});
	
	
})(jQuery);