function encrypt(plaintext, keysquare, keyword) {
    if (!isValidInput(plaintext, keysquare, keyword)) {
        alert("Invalid input.");
        return "";
    }

    let ciphertext1 = [...plaintext.toUpperCase()].map(char => {
        let index = keysquare.toUpperCase().indexOf(char);
        return "ADFGVX"[Math.floor(index / 6)] + "ADFGVX"[index % 6];
    }).join('');

    let ciphertext = columnarTransposition(ciphertext1, keyword);
    
    return ciphertext;
}

function columnarTransposition(ciphertext, keyword) {
    let sortedKeyword = [...keyword].sort().join('');
    let transpositionMatrix = {};
    keyword.split('').forEach(char => transpositionMatrix[char] = []);

    for (let i = 0; i < ciphertext.length; i++) {
        let column = i % keyword.length;
        transpositionMatrix[keyword[column]].push(ciphertext[i]);
    }

    let transposed = '';
    sortedKeyword.split('').forEach((char, index) => {
        let originalColumn = keyword.indexOf(char);
        while (transposed.includes(transpositionMatrix[originalColumn])) {
            originalColumn = keyword.indexOf(char, originalColumn + 1);
        }
        transposed += transpositionMatrix[keyword[originalColumn]].join('');
    });

    return transposed;
}


function isValidInput(plaintext, keysquare, keyword) {
    return keysquare.length === 36 &&
           keyword.length > 1 &&
           /^[a-z0-9]+$/i.test(plaintext);
}

function getTranspositionOrder(keyword) {
    return keyword.split('').map((c, i) => ({char: c, index: i}))
        .sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index)
        .map(c => c.index);
}

function decrypt(ciphertext, keysquare, keyword) {
    if (!/^[ADFGVX]+$/i.test(ciphertext) || ciphertext.length % 2 !== 0 ||
        keysquare.length !== 36 || keyword.length <= 1) {
        alert("Invalid input.");
        return;
    }

    let transpositionOrder = getTranspositionOrder(keyword);
    let regrouped = detranspose(ciphertext, transpositionOrder);
    
    let plaintext = '';
    for (let i = 0; i < regrouped.length; i += 2) {
        let row = "ADFGVX".indexOf(regrouped[i].toUpperCase());
        let col = "ADFGVX".indexOf(regrouped[i + 1].toUpperCase());
        plaintext += keysquare[row * 6 + col].toLowerCase();
    }
    
    return plaintext;
}

function detranspose(text, order) {
    let cols = Array.from({ length: order.length }, () => "");
    let colLength = Math.floor(text.length / order.length);
    
    let idx = 0;
    for (let colIdx of order) {
        let length = colIdx < text.length % order.length ? colLength + 1 : colLength;
        cols[colIdx] = text.slice(idx, idx + length);
        idx += length;
    }
    
    let regrouped = '';
    for (let i = 0; i < colLength; i++) {
        for (let col of cols) {
            regrouped += col[i] || '';
        }
    }
    if (text.length % order.length) {
        cols.forEach(col => {
            if (col[colLength]) regrouped += col[colLength];
        });
    }
    
    return regrouped;
}
