/**
 * 国际象棋训练模型 - 可视化示例
 * 这个示例创建一个简单的命令行可视化界面，展示模型评估结果
 */
const Chess = require('chess.js');
const readline = require('readline');
const { loadModel } = require('../src/test');
const { evaluatePosition } = require('../src/model');

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * 绘制棋盘的彩色表示
 * @param {Chess} chess - chess.js实例
 */
function drawColorBoard(chess) {
  const board = chess.board();
  const symbols = {
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙'
  };
  
  console.log('  ┌───┬───┬───┬───┬───┬───┬───┬───┐');
  
  for (let i = 0; i < 8; i++) {
    let row = `${8-i} │`;
    
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      let symbol = ' ';
      
      if (piece) {
        const pieceSymbol = piece.type.toUpperCase();
        symbol = piece.color === 'w' ? symbols[pieceSymbol] : symbols[pieceSymbol.toLowerCase()];
      }
      
      row += ` ${symbol} │`;
    }
    
    console.log(row);
    
    if (i < 7) {
      console.log('  ├───┼───┼───┼───┼───┼───┼───┼───┤');
    }
  }
  
  console.log('  └───┴───┴───┴───┴───┴───┴───┴───┘');
  console.log('    a   b   c   d   e   f   g   h  ');
}

/**
 * 显示评估结果的可视化表示
 * @param {number} evaluation - 评估分数
 */
function visualizeEvaluation(evaluation) {
  // 将评估分数映射到-10到10的范围
  const score = Math.max(-10, Math.min(10, evaluation * 10));
  
  // 创建评估条
  const barLength = 30;
  const middlePoint = Math.floor(barLength / 2);
  const scorePoint = middlePoint + Math.floor((score / 10) * middlePoint);
  
  let bar = '';
  for (let i = 0; i < barLength; i++) {
    if (i === middlePoint) {
      bar += '|'; // 中点标记
    } else if (i === scorePoint) {
      bar += score > 0 ? '>' : '<'; // 评估标记
    } else if ((score > 0 && i > middlePoint && i < scorePoint) || 
               (score < 0 && i < middlePoint && i > scorePoint)) {
      bar += '='; // 填充评估条
    } else {
      bar += ' '; // 空白
    }
  }
  
  console.log('评估分数: ' + evaluation.toFixed(2));
  console.log(`黑方 ${bar} 白方`);
  console.log(`-1.0 ${' '.repeat(middlePoint - 4)}0.0${' '.repeat(middlePoint - 3)}+1.0`);
}

/**
 * 交互式评估棋盘位置
 */
async function interactiveEvaluation() {
  try {
    console.log('加载训练好的模型...');
    const network = loadModel();
    console.log('模型加载成功！');
    
    // 默认从初始位置开始
    let currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    let chess = new Chess(currentFen);
    
    // 显示初始棋盘
    console.clear();
    console.log('国际象棋位置评估可视化');
    console.log('-----------------------------------');
    drawColorBoard(chess);
    
    const evaluation = evaluatePosition(chess, network);
    visualizeEvaluation(evaluation);
    
    console.log('\n命令:');
    console.log('- 输入FEN字符串评估新的棋盘位置');
    console.log('- 输入 "move [走法]" 执行一步棋 (例如: "move e2e4")');
    console.log('- 输入 "reset" 重置为初始棋盘');
    console.log('- 输入 "exit" 退出程序');
    
    // 开始交互循环
    const askForInput = () => {
      rl.question('\n请输入命令: ', (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log('再见！');
          rl.close();
          return;
        }
        
        try {
          if (input.toLowerCase() === 'reset') {
            // 重置棋盘
            currentFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            chess = new Chess(currentFen);
            console.log('棋盘已重置为初始位置');
          } else if (input.toLowerCase().startsWith('move ')) {
            // 执行走法
            const move = input.substring(5).trim();
            const result = chess.move(move);
            
            if (!result) {
              console.log('无效的走法！请使用代数记号 (例如: e2e4, Nf3)');
              askForInput();
              return;
            }
            
            currentFen = chess.fen();
            console.log(`执行走法: ${move}`);
          } else {
            // 尝试解析为FEN字符串
            try {
              const newChess = new Chess(input);
              chess = newChess;
              currentFen = input;
              console.log('已加载新的棋盘位置');
            } catch (e) {
              console.log('无效的输入！请输入有效的FEN字符串或命令');
              askForInput();
              return;
            }
          }
          
          // 显示更新后的棋盘和评估
          console.clear();
          console.log('国际象棋位置评估可视化');
          console.log('-----------------------------------');
          drawColorBoard(chess);
          
          const evaluation = evaluatePosition(chess, network);
          visualizeEvaluation(evaluation);
          
          console.log('\nFEN: ' + chess.fen());
          console.log(`当前行动方: ${chess.turn() === 'w' ? '白方' : '黑方'}`);
          
          console.log('\n命令:');
          console.log('- 输入FEN字符串评估新的棋盘位置');
          console.log('- 输入 "move [走法]" 执行一步棋 (例如: "move e2e4")');
          console.log('- 输入 "reset" 重置为初始棋盘');
          console.log('- 输入 "exit" 退出程序');
          
        } catch (error) {
          console.log('发生错误:', error.message);
        }
        
        askForInput();
      });
    };
    
    askForInput();
    
  } catch (error) {
    console.error('运行可视化示例时出错:', error.message);
    console.log('请先使用 "node index.js train" 训练模型');
    rl.close();
  }
}

// 运行交互式评估
interactiveEvaluation().catch(error => {
  console.error('程序出错:', error);
  rl.close();
});