export default interface Integridade {

    erro: boolean;
    message: string;
    getErro(): boolean;
    getMessage(): string;
    setErro(erro: boolean, message: string): void;

    montar(): void;

}