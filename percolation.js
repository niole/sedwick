/*
  every time a block is opened, update roots to farthest root, which could be
  the current node
*/

function Percolation(width) {
  //constructor should take time proportional to n2
  this.blocks = [];
  this.width = width;
  this.initBlocks(width);
}

Percolation.prototype.constructor = Percolation;

Percolation.prototype.initBlocks = function(width) {
  if (!this.blocks.length) {
    var i;
    for (i=0 ; i < width*width; i++) {
      this.blocks.push(new Block(i));
    }
  }
};

Percolation.prototype.updateRoots = function(block) {
  var openBlocks = this.getOpenBlocks(block);
  var farthest = this.getFarthestBlock(openBlocks);
  var i;
  for (i=0; i < openBlocks.length; i++) {
    var nextBlock = openBlocks[i];
    if (nextBlock.root.index !== farthest.root.index) {
      nextBlock.updateRoot(farthest);
    }
  }
}

Percolation.prototype.nextState = function() {
  var totalBlocks = this.blocks.length;
  var randIndex;

  while (randIndex === undefined) {
    var nextPossibleIndex = Math.floor(Math.random()*totalBlocks);
    if (!this.isOpen(nextPossibleIndex)) {
      randIndex = nextPossibleIndex;
    }
  }

  this.open(randIndex);
  this.updateRoots(this.get(randIndex));

  //this.print();

  var percolates = this.percolates();
  if (typeof percolates === "number") {
    return percolates;
  }
  //continue
  return this.nextState();
};

Percolation.prototype.open = function(index) {
  // open site if it is not open already
  if (!this.isOpen(index)) {
    this.blocks[index].open = true;
    return true;
  }
  return false;
};

Percolation.prototype.isOpen = function(index) {
  // is site open?
  return this.blocks[index].open;
};

Percolation.prototype.getOpenBlocks = function(block) {
  var index = block.index;
  var y = Math.floor(index/this.width);
  var canCheckAbove = y > 0;
  var canCheckLeft = (index%this.width) > 0;
  var canCheckRight = (index%this.width) < this.width-1;
  var canCheckBelow = y < this.width-1;
  var openIndexes = [];

  if (canCheckAbove) {
    var aboveIndex = index - this.width;
    if (this.isOpen(aboveIndex)) {
      openIndexes.push(this.get(aboveIndex));
    }

    if (canCheckLeft && this.isOpen(aboveIndex-1)) {
      openIndexes.push(this.get(aboveIndex-1));
    }

    if (canCheckRight && this.isOpen(aboveIndex+1)) {
      openIndexes.push(this.get(aboveIndex+1));
    }
  }

  if (canCheckBelow) {
    var belowIndex = index + this.width;
    if (this.isOpen(belowIndex)) {
      openIndexes.push(this.get(belowIndex));
    }

    if (canCheckLeft && this.isOpen(belowIndex-1)) {
      openIndexes.push(this.get(belowIndex-1));
    }

    if (canCheckRight && this.isOpen(belowIndex+1)) {
      openIndexes.push(this.get(belowIndex+1));
    }
  }

  if (canCheckLeft && this.isOpen(index-1)) {
    openIndexes.push(this.get(index-1));
  }

  if (canCheckRight && this.isOpen(index+1)) {
    openIndexes.push(this.get(index+1));
  }
  openIndexes.push(block);
  return openIndexes;
};

Percolation.prototype.get = function(index) {
  return this.blocks[index];
};

Percolation.prototype.getFarthestBlock = function(openBlocks) {
  return openBlocks.reduce(function(farthestBlock, nextBlock) {
    if (nextBlock.root.index > farthestBlock.root.index) {
      return nextBlock;
    }
    return farthestBlock;
  }, { root: { index: -1 } });
};

Percolation.prototype.print = function() {
  var formatted = this.blocks.map(function(b) {
    return b.root.index;
  });
  var grid = [];
  var j;
  for (j=0; j < this.width; j++) {
    var width = [];
    var i;
    for (i=0; i < this.width; i++) {
      var index = j*this.width + i;
      width.push(this.blocks[index].root.index);
    }
    grid.push(width);
  }

  console.log(grid);
};


Percolation.prototype.isEndIndex = function(block) {
  var index = block.root.index;
  var totalBlocks = this.blocks.length;
  return index > totalBlocks-this.width && index < totalBlocks;
};

Percolation.prototype.isStartIndex = function(block) {
  var index = block.root.index;
  return index > -1 && index < this.width;
};

Percolation.prototype.percolates = function() {
  var totalBlocks = this.blocks.length;
  // does the system percolate?
  //run union find
  var i;
  for (i=0; i < this.width; i++) {
    var startBlock = this.get(i);
    var endBlock = this.get(totalBlocks-i-1);
    if (this.isEndIndex(startBlock)) {
      return endBlock.root.index;
    }

    if (this.isStartIndex(endBlock)) {
      return endBlock.root.index;
    }

  }
  return false;
};

function Block(index) {
  this.open = false;
  this.index = index;
  this.root = this;
}

Block.prototype.updateRoot = function(block) {
  this.root = block.root;
}

Block.prototype.clear = function() {
  this.open = true;
}

function percolatorSimulation(width, totalRuns) {
  var openSlots = [];
  return function() {
    var i;
    for (i=0; i < totalRuns; i++) {
      var p = new Percolation(width);
      var res = p.nextState();
      p.print();
      var total = p.blocks.filter(function(b) {
        return b.root.index === res;
      });
      openSlots.push((total.length/p.blocks.length)*100);
    }
    console.log(openSlots);
    return openSlots;
  };

}

var simulator = percolatorSimulation(3, 50);
simulator();

