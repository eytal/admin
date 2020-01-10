
export class ButtonControl {

    public canOpen: boolean;
    public canStart: boolean;
    public canShowNext: boolean;
    public canNext: boolean;
    public canEnd: boolean;
    public canShowEnd: boolean;
    public canReset: boolean;
    public canUnlock: boolean;

    constructor(){
        this.canOpen = true;
        this.canStart = false;
        this.canNext = false;
        this.canShowNext = false;
        this.canEnd = false;
        this.canShowEnd = false;
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

    reset(){
        this.canOpen = true;
        this.canStart = false;
        this.canNext = false;
        this.canShowNext = false;
        this.canEnd = false;
        this.canShowEnd = false;
        this.canReset = false;
        this.canUnlock = false;
    }

}
