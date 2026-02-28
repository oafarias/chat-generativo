JAVASCRIPT - CHATZZERIA

const apiKey = "SUA-CHAVE-API"



// ------------------- ELEMENTOS DA PÁGINA -------------------

// Pega a seção do chat onde as mensagens vão aparecer
const secaoConversa = document.getElementById("div_conversa");
// Pega o campo de texto (textarea) onde o usuário digita a pergunta
const pergunta = document.getElementById("pergunta");
// Novo elemento para mostrar o resultado visual do OCR
const divResultadosOCR = document.getElementById("div_resultados_ocr");

// ------------------- FUNÇÃO PRINCIPAL (AZURE OPENAI) -------------------
function callAzureOpenAI(pergunta2) {
  const url =`SUA-URL`

  // Configuração da requisição (o que será enviado para a API)
  const config = {
    messages: [
      {
        role: "system",
        content: `c`,
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
  if (className === "div_card_conversa_chat") {
    secaoConversa.innerHTML += `
<div class="div_card_conversa" id="${className}">
<button type="button">
<img id="img_audio" src="../assets/img/audio.svg" alt="Botão de áudio">
</button>

<p>${messageContent}</p>

<img id="img_bot" src="../assets/img/bot.svg" alt="Imagem do robô">
</div>
`;
  } else {
    secaoConversa.innerHTML += `
<div class="div_card_conversa" id="${className}">
<p>${messageContent}</p>
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



