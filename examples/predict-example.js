/**
 * 国际象棋训练模型 - 使用示例
 * 这个示例展示如何使用训练好的模型评估一系列棋盘位置
 */
const Chess = require('chess.js');
const path = require('path');
const { loadModel } = require('../src/test');
const { evaluatePosition } = require('../src/model');

/**
 * 展示如何使用模型评估一系列棋盘位置
 */
async function runPredictionExample() {
  try {
    console.log('加载训练好的模型...');
    const network = loadModel();
    
    // 一些有趣的棋盘位置进行评估
    const positions = [
      // 初始位置
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      
      // 王后开局
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      
      // 王翼弃兵开局
      'rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3 0 1',
      
      // 英国开局
      'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1',
      
      // 中局位置示例
      'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 7',
      
      // 残局示例
      '4k3/8/8/8/8/8/3P4/3K4 w - - 0 1'
    ];
    
    console.log('评估不同的棋盘位置:');
    console.log('-----------------------------------');
    
    for (const fen of positions) {
      const chess = new Chess(fen);
      const evaluation = evaluatePosition(chess, network);
      
      console.log(`FEN: ${fen}`);
      console.log(`评估分数: ${evaluation.toFixed(3)}`);
      console.log(`当前行动方: ${chess.turn() === 'w' ? '白方' : '黑方'}`);
      console.log('棋盘:');
      console.log(chess.ascii());
      console.log('-----------------------------------');
    }
    
    console.log('\n解读评估分数:');
    console.log('- 正值: 对白方有利');
    console.log('- 负值: 对黑方有利');
    console.log('- 接近0: 双方均势');
    
  } catch (error) {
    console.error('运行示例时出错:', error.message);
    console.log('请先使用 "node index.js train" 训练模型');
  }
}

// 运行示例
runPredictionExample().catch(console.error);