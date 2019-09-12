export let run: boolean = false;

export const setAppStatus = (con: boolean) => {
    if (!con) cleanUp();
    run = con;
};

function cleanUp(): void {
    const els: any = document.querySelectorAll('.dynamic-create');
    els.forEach((el: any) => {
        el.parentNode.removeChild(el);
        el.destroy();
    });
}