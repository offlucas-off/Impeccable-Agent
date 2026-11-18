import './studio/styles.css';
import { mountPixelizerStudio } from './studio/ui/studioApp';

const appRoot = document.getElementById('app');
if (appRoot) {
  mountPixelizerStudio(appRoot);
}
