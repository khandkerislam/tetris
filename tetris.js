const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
//const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 40;
const VACANT = "WHITE"; // color of an empty square

const MIDPOINT = 4; // point to drop in a block

const zblock = [
    [1,1,0],
    [0,1,1],
    [0,0,0]
]

const tblock = [
    [0,0,0],
    [1,1,1],
    [0,1,0]
]

const sblock = [
    [0,1,1],
    [1,1,0],
    [0,0,0]
]

const jblock = [
    [0,0,1],
    [1,1,1],
    [0,0,0]
]

const lblock = [
    [1,0,0],
    [1,1,1],
    [0,0,0]
]

const oblock = [
    [1,1,0],
    [1,1,0],
    [0,0,0]
]

const iblock = [
    [1],
    [1],
    [1],
    [1]
]

const blocks = [zblock,tblock,sblock,jblock,lblock,oblock,iblock]

let currentPiece;
let beginY = 0;
let currentY = 0;
let currentX = 0;

function setCurrentPiece(piece){
    return piece;
}

function setCurrentY(piece){
    return piece.length-1+beginY
}


function findCollisionZoneRight(piece){
    let collisions = [];
    let searchY = currentY;
    let searchX = currentX+piece.length-1;

    for(i = piece.length-1; i >= 1; i--){
        for(l = piece.length-1; l >= 0; l--){
            if(piece[l][i]){
                if(i == piece.length-1){
                    collisions.push({x:searchX, y:searchY});
                }
                else if(piece[l][i]+piece[l][i+1] == 1 && i == 1){
                    collisions.push({x:searchX, y:searchY});
                    
                }
            }
            searchY--;
        }
        searchX--;
        searchY=currentY;
    }
}

function findCollisionZoneLeft(piece){
    let collisions = [];
    let searchY = currentY;
    let searchX = currentX;

    for(i = 0; i <= 1; i++){
        for(l = piece.length-1; l >= 0; l--){
            if(piece[l][i]){
                if(i == 0){
                    collisions.push({x:searchX, y:searchY});
                }
                else if(piece[l][i]+piece[l][i-1] == 1 && i == 1){
                    collisions.push({x:searchX, y:searchY});
                    
                }
            }
            searchY--;
        }
    
        searchX++;
        searchY=currentY;
    }
}

function findCollisionZoneBottom(piece){

    let collisions = [];
    let searchY = currentY;
    let searchX = currentX;

    //we should rewrite this, its awful.
    //we have established the currentY
    //we want the loop to go in columns.
    //if its a one, get the row number and subtract that from the currentY
    //so lets say we find one at 2,1.  the current y is 2. so now what...
    //well how bout we find one at 0,0.  if current y is 2, we want to mark 0 as the correct y location.
    //so...lets say we are actually searching by columns.  
    
    for(i = 0; i < piece.length; i++){
        for(l = piece.length-1; l >= 0; l--){
            if(piece[l][i]){
                collisions.push({x:searchX,y:searchY})
                searchY = currentY;
                break;
            }
            else if(!piece[l][i]){
                if(l == 0){
                    searchY = currentY
                }
                else{
                    searchY--;
                }
            }
        }
        searchX++;
    }
    console.table(collisions)
    return collisions
}

function newPiece(x,y,piece){
    currentPiece = setCurrentPiece(piece);
    currentY = setCurrentY(piece)
    currentX = x;
    for(i = 0; i<piece.length; i++){
        for(l = 0; l<piece[i].length; l++){
            if(piece[i][l]==1){
                board[i+y][l+x] = 1;
                drawSquare(l+x,i+y,"RED");
            }
        }
    }
}

function moveDown(piece){
    let collisions = findCollisionZoneBottom(piece);
    let status = true;
    let start = currentX
    collisions.some(element =>{
        if(board[element.y+1][element.x] || element.y+1 > board.length){
            status = false;
        }
    });
    console.table(board);
    if(status){
        let newLine = (currentY-(piece.length-1));
        clearPiece(piece,start,newLine);
        drawPiece(piece,start,newLine+1)
        currentPiece = setCurrentPiece(piece);
    }
    else{
        start = MIDPOINT;
    }
    currentY++
    console.log(currentY)
}


function clearSquare(x,y){
    ctx.fillStyle = 'WHITE';
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}


// draw a square
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

function drawPiece(piece,start,end){
    for(i = 0; i<piece.length; i++){
        for(l = 0; l<piece[i].length; l++){
            if(piece[i][l]==1){
                board[i+end][l+start] = 1;
                drawSquare(l+start,i+end,"RED");
            }
        }
    }
}

function clearPiece(piece,start,end){
    for(i = 0; i<piece.length; i++){
        for(l = 0; l<piece[i].length; l++){
            if(piece[i][l]==1){
                board[i+end][l+start] = 0;
                clearSquare(l+start,i+end);
            }
        }
    }
}
// create the board
let board = [];
for( r = 0; r <ROW; r++){
    board.push([]);
    for(c = 0; c < COL; c++){
        board[r][c] = 0;
        drawSquare(c,r,VACANT);
    }
}

let dropStart = Date.now();
let gameOver = false;

function randomPiece(blocks){
    return blocks[Math.floor(Math.random() * blocks.length)]
}

function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        dropStart = Date.now();
        moveDown(currentPiece);
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

//drawSquare(4,6,'blue')
newPiece(4,0,tblock);
//findCollisionZoneBottom(currentPiece);
//clearPiece(currentPiece,MIDPOINT,0);
drop()
//findCollisionZoneRight(currentPiece);
//findCollisionZoneLeft(currentPiece);