
export class ButtonControl {

    public canOpen: boolean;
    public canStart: boolean;
    public canNext: boolean;
    public canEnd: boolean;
    public canReset: boolean;
    public canUnlock: boolean;

    constructor(){
        this.canOpen = true;
        this.canStart = false;
        this.canNext = false;
        this.canEnd = false;
        this.canReset = false;
        this.canUnlock = false;
    }

    toggle(param: string){
        switch(param) {
            case 'open':
                this.canOpen = !this.canOpen;
                break;
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

    set(param: string, value: boolean){
        switch (param) {
            case 'open':
                this.canOpen = value;
                break;
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

    reset(){
        this.canOpen = true;
        this.canStart = false;
        this.canNext = false;
        this.canEnd = false;
        this.canReset = false;
        this.canUnlock = false;
    }

}