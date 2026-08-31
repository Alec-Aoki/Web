const jwt = require("jsonwebtoken");

function requireAuth(req, res, next){
    // esperamos que o cliente envie Authorization: Bearer <token>
    // no header da requisição
    const authHeader = req.headers.authorization;

    // Divide "Bearer eyJhbGc..." em ["Bearer", "eyJhbGc..."] e pega
    // o índice 1, que é o token em si, sem o prefixo "Bearer"
    // o ?. é optional chaning e impede que crash caso o header esteja
    // faltando
    const token = authHeader?.split(" ")[1];

    if(!token){
        return res.status(401).json({error: "Nenhum token providenciado."});
    }

    try{
        // Recomputa a assinatura e se não bater/tiver expirado, joga erro
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Toda rota depois desse middleware pode ler req.userId diretamente,
        // já verificado, sem ficar re-checando toda vez
        req.userId = payload.userId;

        // Passa o controle pro próximo handler na cadeia (a lógica de rotas)
        // Não pode omitir isso senão fica preso aq pra sempre!
        next();
    } catch{
        res.status(401).json({error: "Token inválido ou expirado."});
    }
}

module.exports = requireAuth;