
var game;
function startGame() {
    document.getElementById("game-container").style.display="block";
    document.getElementById("controls").style.display="none";

    
    var rows = parseInt(document.getElementById('rows').value);
    var cols = parseInt(document.getElementById('cols').value);
    var winSeq = parseInt(document.getElementById('winSeq').value);
    
    if (game) {
        game.destroy();
    }
    
    game = new Phaser.Game(720, 1280, Phaser.CANVAS, 'game-container', {
        preload: preload,
        create: function() { create(rows, cols, winSeq); },
        update: update
    });
}

function preload() {
    game.stage.backgroundColor = '#111';
}

function create(rows, cols, winSeq) {

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    board = game.add.group();
    drawBoard(rows, cols);

    /*var cellSize = Math.min(game.world.width / cols, (game.world.height * 0.8) / rows);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = game.add.graphics(j * cellSize, i * cellSize);
            cell.lineStyle(2, 0xffffff);
            cell.drawRect(0, 0, cellSize, cellSize);
            cell.inputEnabled = true;
            cell.events.onInputDown.add(onCellClick, { x: j, y: i });
        }
    }*/
}
function drawBoard(rows, cols) {
    cellSize = Math.min(game.world.width / cols, (game.world.height * 0.8) / rows);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = game.add.graphics(j * cellSize, i * cellSize);
            cell.beginFill(0xffffff);
            cell.lineStyle(2, 0x000000);
            cell.drawRect(0, 0, cellSize, cellSize);
            cell.endFill();
            cell.inputEnabled = true;
            cell.events.onInputDown.add(cellClicked, this);
            board.add(cell);
        }
    }
}

function cellClicked(cell) {
    console.log("Cell clicked at: ", cell.x / cellSize, cell.y / cellSize);
}
function update() {
}

function onCellClick() {
    console.log("Cell clicked: ", this.x, this.y);
}
