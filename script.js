const apiKey = "6ArLGYzuwwMzltGxKft98M7gkcKw9hBMHUfbNs87XGjYKxks1aD2JQQJ99CBACYeBjFXJ3w3AAABACOGbwGp";


// ------------------- ELEMENTOS DA PÁGINA -------------------

// Pega a seção do chat onde as mensagens vão aparecer
const secaoConversa = document.getElementById("div_conversa");
// Pega o campo de texto (textarea) onde o usuário digita a pergunta
const pergunta = document.getElementById("pergunta");
// Novo elemento para mostrar o resultado visual do OCR
const divResultadosOCR = document.getElementById("div_resultados_ocr");

// ------------------- FUNÇÃO PRINCIPAL (AZURE OPENAI) -------------------
function callAzureOpenAI(pergunta2) {

  const url = `https://canudo-de-papel.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview`;

  // Configuração da requisição (o que será enviado para a API)
  const config = {
    messages: [
      {
        role: "system",
        content: `Voce é um concierge virtual do shopping Paulista Prime. E sua função é ajudar os clientes a encontrar lojas, produtos, serviços e eventos no shopping. Você tem acesso a um banco de dados atualizado com as informações do shopping, incluindo localização das lojas, horários de funcionamento e segmento das loja. Responda às perguntas dos clientes de forma clara e amigável, fornecendo informações precisas e úteis para melhorar a experiência de compra no shopping Paulista Prime.
        Você não tem acesso a informações pessoais dos clientes, e deve respeitar a privacidade e segurança dos dados. Se um cliente fizer uma pergunta que não esteja relacionada ao shopping ou que envolva informações pessoais, responda educadamente que não pode ajudar com essa questão.

        Lista de lojas do shopping Paulista Prime:
        [
  {
    "id": 1,
    "nome": "Estilo Urbano",
    "categoria": "Moda Masculina",
    "horario_funcionamento": "10h às 22h",
    "box": 101
  },
  {
    "id": 2,
    "nome": "Bella Donna",
    "categoria": "Moda Feminina",
    "horario_funcionamento": "10h às 22h",
    "box": 102
  },
  {
    "id": 3,
    "nome": "TechWorld",
    "categoria": "Eletrônicos",
    "horario_funcionamento": "10h às 22h",
    "box": 205
  },
  {
    "id": 4,
    "nome": "Mundo Kids",
    "categoria": "Moda Infantil",
    "horario_funcionamento": "10h às 21h",
    "box": 118
  },
  {
    "id": 5,
    "nome": "Sabor & Cia",
    "categoria": "Alimentação",
    "horario_funcionamento": "11h às 23h",
    "box": 310
  },
  {
    "id": 6,
    "nome": "Livraria Horizonte",
    "categoria": "Livraria",
    "horario_funcionamento": "10h às 22h",
    "box": 221
  },
  {
    "id": 7,
    "nome": "FitPower",
    "categoria": "Artigos Esportivos",
    "horario_funcionamento": "10h às 22h",
    "box": 134
  },
  {
    "id": 8,
    "nome": "Glamour Cosméticos",
    "categoria": "Perfumaria",
    "horario_funcionamento": "10h às 22h",
    "box": 156
  },
  {
    "id": 9,
    "nome": "Casa & Conforto",
    "categoria": "Utilidades Domésticas",
    "horario_funcionamento": "10h às 22h",
    "box": 178
  },
  {
    "id": 10,
    "nome": "Studio Vision",
    "categoria": "Ótica",
    "horario_funcionamento": "10h às 22h",
    "box": 199
  }
]`,
      },
      {
        // "user" é a mensagem enviada pelo usuário
        role: "user",
        content: pergunta2,
      },
    ],
    max_tokens: 800, // Define o tamanho máximo da resposta em "tokens".
    temperature: 0, // Controla a criatividade da IA.
    top_p: 0.95, // Controla a "probabilidade cumulativa" das palavras escolhidas.
    frequency_penalty: 0, // Penaliza repetições de palavras/frases.
    presence_penalty: 0, // Incentiva ou não trazer novos assuntos.
  };

  // ------------------- CHAMADA À API -------------------
  try {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(config),
    })
      .then((response) => response.json())
      .then((result) => {
        addMessageToChat(
          "div_card_conversa_chat",
          result.choices[0].message.content
        );
        console.log(result.choices[0].message.content);
      })
      .catch((error) => {
        addMessageToChat("div_card_conversa_chat", `Erro: ${error.message}`);
        console.log(error);
      });
  } catch (error) {
    addMessageToChat("div_card_conversa_chat", error);
    console.log(error.message);
    console.log(error);
  }
}

function addMessageToChat(className, messageContent) {
  const htmlContent = marked.parse(messageContent);

  if (className === "div_card_conversa_chat") {
        secaoConversa.innerHTML += `
            <div class="div_card_conversa" id="${className}">
                <button type="button">
                    <img id="img_audio" src="../img/audio.svg" alt="Botão de áudio">
                </button>
                <div class="markdown-body">${htmlContent}</div>
                <img id="img_bot" src="../img/bot.svg" alt="Imagem do robô">
            </div>
        `;
    } else {
        secaoConversa.innerHTML += `
            <div class="div_card_conversa" id="${className}">
                <div class="markdown-body">${htmlContent}</div>
            </div>
        `;
    }
    secaoConversa.scrollTop = secaoConversa.scrollHeight;
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  const userMessage = pergunta.value.trim();

  addMessageToChat("div_card_conversa_usuario", userMessage);

  callAzureOpenAI(userMessage);

  pergunta.value = "";
});