export default function changeTransitionFix(status: boolean): void {
  for (const element of document.querySelectorAll<HTMLElement>('.transition_fix')) {
    if (status) {
      element.style.transitionProperty = 'none';
    } else {
      element.style.cssText = '';
    }
  }
}

changeTransitionFix(true);
