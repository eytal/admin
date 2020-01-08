
export class ButtonControl {

    public canStart: boolean;
    public canNext: boolean;
    public canEnd: boolean;
    public canReset: boolean;
    public canUnlock: boolean;

    constructor(){
        this.canStart = true;
        this.canNext = false;
        this.canEnd = false;
        this.canReset = false;
        this.canUnlock = false;
    }

    toggle(param: string){
        switch(param) {
            case 'start':
                this.canStart = !this.canStart;
                break;
            case 'next':
                this.canNext = !this.canNext;
                break;
            case 'end':
                this.canEnd = !this.canEnd;
                break;
            case 'reset':
                this.canReset = !this.canReset;
                break;
            case 'unlock':
                this.canUnlock = !this.canUnlock;
                break;
            default:
                console.log('invalid toggle');
        }
    }

    set(param: string, value: true){
        switch (param) {
            case 'start':
                this.canStart = value;
                break;
            case 'next':
                this.canNext = value;
                break;
            case 'end':
                this.canEnd = value;
                break;
            case 'reset':
                this.canReset = value;
                break;
            case 'unlock':
                this.canUnlock = value;
                break;
            default:
                console.log('invalid set');
        }
    }

}