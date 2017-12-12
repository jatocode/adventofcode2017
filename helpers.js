// Test functions
var start = Node(1, 1);
var end = Node(7, 4);
var testArray = [
    '.#.####.##',
    '..#..#...#',
    '#....##...',
    '###.#.###.',
    '.##..#..#.',
    '..##....#.',
    '#...##.###'
];

var shortestPath = [[7, 4], [6, 4], [6, 5], [5, 5], [4, 5], [4, 4], [3, 4], [3, 3], [3, 2], [2, 2], [1, 2]];
printTestArray();

// BFS
var path = BFS(start, end, pathCheckTest);
if (path.length < 0) {
    console.log('Path finder failed');
}
var prettypath = prettyPrintPath(path);
console.log('Path length: ' + path.length);

// A*
path = astar(start, end, pathCheckTest, manhattan);
if (path.length < 0) {
    console.log('Path finder failed');
}
console.log('Path length: ' + path.length);

// DFS
path = DFS(start, end, pathCheckTest);
if (path.length < 0) {
    console.log('Path finder failed');
}
console.log('Path length: ' + path.length);
console.log(prettyPrintPath(path));

// Now test with input from 2016/13
path = BFS(Node(1, 1), Node(31, 39), openSpace);
console.log(path.length);

path = astar(Node(1, 1), Node(31, 39), openSpace, manhattan);
console.log(path.length);

path = DFS(Node(1, 1), Node(31, 39), openSpace, manhattan);
console.log(path.length);
/* END OF TEST */

// A* by Tobias
function astar(start, end, possiblePath, heuristic) {
    var closed = [];
    var open = [];

    console.log('A*, looking for path from ' + start.xy + ' to ' + end.xy);

    start.g = 0;
    start.f = heuristic(start, end);
    open.push(start);

    var steps = 0;
    while (open.length > 0) {
        steps++;
        current = lowestF(open);
        if (current.x() == end.x() && current.y() == end.y()) {
            var path = [];
            while (current.parent != undefined) {
                path.push(current);
                current = findNode(current.parent, closed);
            }
            console.log('Found in ' + steps + ' steps');
            return path;
        }

        closed.push(current);
        var neighb = neighb4(current);
        for (i in neighb) {
            var n = neighb[i];
            if (findNode(n, closed)) {
                continue;
            }
            if (!possiblePath(n.x(), n.y())) {
                closed.push(n);
                continue;
            }

            var tg = current.g + heuristic(current, n);
            if (!findNode(n, open)) {
                open.push(n);
            } else if (tg >= n.g) {
                continue; // Worse path
            }

            n.parent = current;
            n.g = tg;
            n.f = n.g + heuristic(n, end);
        }
    }
    return -1;
}

function lowestF(open) {
    var fmin = Number.MAX_SAFE_INTEGER;
    var min = 0;
    for (i in open) {
        if (open[i].f < fmin) {
            fmin = open[i].f;
            min = i;
        }
    }
    var el = open[min];
    open.splice(min, 1);
    return el;
}

function manhattan(from, to) {
    return (Math.abs(from.x() - to.x()) + Math.abs(from.y() - to.y()));
}


// Breadth First
function BFS(root, end, possiblePath) {

    console.log('BFS, looking for path from ' + root.xy + ' to ' + end.xy);

    var Q = [];
    var V = [];
    root.distance = 0;
    Q.push(root);

    var steps = 0;
    while (Q.length > 0) {
        steps++;
        var current = Q.shift();
        if (current.x() == end.x() && current.y() == end.y()) {
            var path = [];
            while (current.parent != undefined) {
                path.push(current);
                current = findNode(current.parent, V);
            }
            console.log('Found in ' + steps + ' steps');
            return path;
        }

        if (findNode(current, V)) {
            continue;
        }
        V.push(current);
        var neighb = neighb4(current);
        for (i in neighb) {
            var n = neighb[i];
            if (findNode(n, Q)) {
                continue;
            }
            if (possiblePath(n.x(), n.y())) {
                if (n.distance == undefined) {
                    n.distance = current.distance + 1;
                    n.parent = Node(current.x(), current.y());
                    n.parent.distance = current.distance;
                    Q.push(n);
                }
            }
        }
    }

    return -1;
}

// Depth first
function DFS(start, end, possiblePath) {
    var S = [];
    var V = [];
    console.log('DepthFS, looking for path from ' + start.xy + ' to ' + end.xy);
    S.push(start);
    var steps = 0;
    while (S.length > 0) {
        steps++;
        var current = S.pop();
        if (current.x() == end.x() && current.y() == end.y()) {
            var path = [];
            while (current.parent != undefined) {
                path.push(current);
                current = findNode(current.parent, V);
            }
            console.log('Found in ' + steps + ' steps');
            return path;
        }

        if (!findNode(current, V)) {
            V.push(current);
            var neighb = neighb4(current);
            for (i in neighb) {
                var n = neighb[i];
                if (possiblePath(n.x(), n.y())) {
                    S.push(n);
                    n.parent = current;
                }
            }
        }
    }
    return -1;
}

function findNode(v, V) {
    for (i in V) {
        if (V[i].x() == v.x() && V[i].y() == v.y()) {
            return V[i];
        }
    }
    return 0;
}

function neighb4(node) {
    return [Node(node.x(), node.y() + 1),
    Node(node.x(), node.y() - 1),
    Node(node.x() + 1, node.y()),
    Node(node.x() - 1, node.y())];
}

function Node(x, y) {
    var n = {
        xy: [x, y],
        distance: undefined,
        g: Number.MAX_SAFE_INTEGER,
        f: Number.MAX_SAFE_INTEGER,
        x: function () { return this.xy[0]; },
        y: function () { return this.xy[1]; },
    };
    return n;
}

// For testing
function prettyPrintPath(path) {
    var prettyp = [];
    for (p in path) {
        var node = path[p];
        prettyp.push(node.xy);
    }
    return prettyp;
}

function comparePath(a, b) {
    for (y in a) {
        if (a[y] != b[y]) {
            return false;
        }
    }
    return true;
}

function pathCheckTest(x, y) {
    //console.log(y + ': ' + testArray[y]);
    if (x < 0 || y < 0 || y > testArray.length - 1 || x > testArray[y].length - 1) {
        return false;
    }
    var xdata = testArray[y].split('');
    //console.log(xdata[x]);
    if (xdata[x] == '#') {
        return false;
    }
    return true;
}

function printTestArray() {
    console.log('  0123456789');
    for (y in testArray) {
        console.log(y + ' ' + testArray[y]);
    }
    console.log();
}

function openSpace(x, y) {
    if (x < 0 || y < 0) {
        return false;
    }
    var f = x * x + 3 * x + 2 * x * y + y + y * y;
    f = f + parseInt(1352);

    var count = krCount(f);
    var open = (count % 2) == 0;
    return open;
}

// Snodde en K&R algoritm for att rakna ettor
function krCount(value) {
    var count;
    for (count = 0; value != 0; count++ , value &= value - 1);
    return count;
}

//DFS
function dfs(start, callback) {
    var stack = [start];
    var n;

    while (stack.length > 0) {

        n = stack.pop();
        callback(n.value);

        if (!n.children) {
            continue;
        }

        for (var i = n.children.length - 1; i >= 0; i--) {
            stack.push(n.children[i]);
        }
    }
};

//BFS
function bfs(start, callback) {
    var queue = [start];
    var n;

    while (queue.length > 0) {

        n = queue.shift();
        callback(n.value);

        if (!n.children) {
            continue;
        }

        for (var i = 0; i < n.children.length; i++) {
            queue.push(n.children[i]);
        }
    }
};