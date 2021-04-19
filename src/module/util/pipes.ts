export default {
    pipeToPromise: pipe => {
        return new Promise(resolve => {
            const sub = pipe.subscribe(ev => {
                resolve(ev);
                sub.unsubscribe();
            });
        });
    }
}