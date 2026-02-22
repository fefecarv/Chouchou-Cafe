export class Produto { 

    /**
     * método construtor da classe produto
     * 
     * @param {string} n nome do produto
     * @param {float} p preco do produto
     * @param {string} f link foto do produto 
     * @param {string} d descricao do produto
     * @param {Array} cat categoria do produto
     * @param {Array} u unidade do produto  
     */
    constructor(n, p, f, d, cat, u) { 
        this.nome = n;    
        this.preco = p; 
        this.fotoLink = f;
        this.descricao = d;
        this.categoria = cat; 
        this.unidade = u; 
    }

    getNome() {
        return this.nome;
    }

    getPreco() {
        return this.preco;
    }

    getFotoLink() {
        return this.fotoLink;
    }

    getDescricao() {
        return this.descricao;
    }

    getCategoria(){
        return this.categoria;
    }

    getUnidade(){
        return this.unidade;
    }

    setNome(n) {
        this.nome = n;
    }

    setPreco(p) {
        this.preco = p;
    }

    setFotoLink(f) {
        this.fotoLink = f;
    }

    setDescricao(d) {
        this.descricao = d;
    }

    setCategoria(cat){
        this.categoria = cat;
    }

    setUnidade(u){
        this.unidade = u;
    }
}