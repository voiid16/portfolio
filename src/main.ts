import './styles.css';
import { initTree } from './tree';
import { initNav } from './nav';
import { initReveal } from './reveal';

const canvas = document.getElementById('tree-canvas') as HTMLCanvasElement;
if (canvas) initTree(canvas);

initNav();
initReveal();
