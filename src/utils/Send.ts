export default class Send {

    private response = {
        message: "",
        statusCode: 400,
        list: [] as any,
        one: {}
    };

    constructor() {}

    message(msn: string) {
        this.response.message = msn;
    }

    status(valor: number) {
        this.response.statusCode = valor;
    }

    data(data: object[]) {
        this.response.list = data;
    }

    one(res: object) {
        this.response.one = res;
    }

    get() {
        return this.response;
    }

}