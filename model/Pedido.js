export class Pedido { 

    /**
     * método construtor da classe Pedidos
     * 
     * @param {int} cc codigo cliente
     * @param {int} pc codigo produto
     * @param {Array} s status produto
     * @param {string} c cep
     */
    constructor(cc, pc, s, c) { 
        this.codigoCliente = cc;
        this.codigoProduto = pc;    
        this.status = s; 
        this.cep = c;
    }

    getClienteCodigo() {
        return this.codigoCliente;
    }

    getProdutoCodigo() {
        return this.codigoProduto;
    }

    getStatus() {
        return this.status;
    }

    getCep() {
        return this.cep;
    }

    setClienteCodigo(cc) {
        this.codigoCliente = cc;
    }

    setProdutoCodigo(pc) {
        this.codigoProduto = pc;
    }

    setStatus(s) {
        this.status = s;
    }

     setCep(c) {
        this.cep = c;
    }
}