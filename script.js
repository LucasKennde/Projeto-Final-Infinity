let disponibilidade = {};
let dataSelecionada = null;
let horarioSelecionado = null;

function inicializarApp() {
  criarConfiguracaoDisponibilidade();
}

function criarConfiguracaoDisponibilidade() {
  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const container = document.getElementById("configuracao-disponibilidade");

  diasSemana.forEach((dia) => {
    const divDia = document.createElement("div");
    divDia.innerHTML = `
            <h3>${dia}</h3>
            <input type="checkbox" id="${dia.toLowerCase()}" name="${dia.toLowerCase()}" onchange="toggleHorarios('${dia.toLowerCase()}')">
            <label for="${dia.toLowerCase()}">Disponível</label>
            <div id="horarios-${dia.toLowerCase()}" style="display: none;">
                <input type="time" id="inicio-${dia.toLowerCase()}">
                <input type="time" id="fim-${dia.toLowerCase()}">
            </div>
        `;
    container.appendChild(divDia);
  });
}

function toggleHorarios(dia) {
  const horariosDiv = document.getElementById(`horarios-${dia}`);
  const checkbox = document.getElementById(dia);
  if (horariosDiv && checkbox) {
    horariosDiv.style.display = checkbox.checked ? "block" : "none";
  }
}

function salvarDisponibilidade() {
  const diasSemana = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  diasSemana.forEach((dia) => {
    const checkbox = document.getElementById(dia);
    const inicioInput = document.getElementById(`inicio-${dia}`);
    const fimInput = document.getElementById(`fim-${dia}`);

    if (checkbox && checkbox.checked && inicioInput && fimInput) {
      disponibilidade[dia] = {
        inicio: inicioInput.value,
        fim: fimInput.value,
      };
    }
  });

  console.log("Disponibilidade salva:", disponibilidade);

  const tela1 = document.getElementById("tela1");
  const tela2 = document.getElementById("tela2");

  if (tela1 && tela2) {
    tela1.style.display = "none";
    tela2.style.display = "block";
    criarCalendario();
  } else {
    console.error("Elementos de tela não encontrados");
  }
}

function criarCalendario() {
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const diasSemanaContainer = document.getElementById("dias-semana");
  const calendario = document.getElementById("calendario");

  if (!diasSemanaContainer || !calendario) {
    console.error("Elementos do calendário não encontrados");
    return;
  }

  diasSemanaContainer.innerHTML = "";
  calendario.innerHTML = "";

  // Adicionar dias da semana
  diasSemana.forEach((dia) => {
    const diaElement = document.createElement("div");
    diaElement.textContent = dia;
    diasSemanaContainer.appendChild(diaElement);
  });

  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  // Adicionar dias vazios no início do mês
  for (let i = 0; i < primeiroDiaMes.getDay(); i++) {
    const diaVazio = document.createElement("div");
    diaVazio.classList.add("dia");
    calendario.appendChild(diaVazio);
  }

  // Adicionar dias do mês
  for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
    const dia = document.createElement("div");
    dia.classList.add("dia");
    dia.textContent = i;

    const data = new Date(hoje.getFullYear(), hoje.getMonth(), i);
    const diaSemana = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ][data.getDay()];

    if (disponibilidade[diaSemana]) {
      dia.classList.add("disponivel");
    }

    dia.onclick = () => selecionarData(i);
    calendario.appendChild(dia);
  }
}

function selecionarData(dia) {
  dataSelecionada = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    dia
  );
  const diaSemana = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ][dataSelecionada.getDay()];

  if (disponibilidade[diaSemana]) {
    const tela2 = document.getElementById("tela2");
    const tela3 = document.getElementById("tela3");

    if (tela2 && tela3) {
      tela2.style.display = "none";
      tela3.style.display = "block";
      mostrarConfirmacao();
    } else {
      console.error("Elementos de tela não encontrados");
    }
  } else {
    alert("Esta data não está disponível para agendamento.");
  }
}

function mostrarConfirmacao() {
  const detalhes = document.getElementById("detalhes-agendamento");
  if (!detalhes) {
    console.error("Elemento de detalhes não encontrado");
    return;
  }

  const diaSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ][dataSelecionada.getDay()];
  const dataFormatada = `${dataSelecionada.getDate()}/${
    dataSelecionada.getMonth() + 1
  }/${dataSelecionada.getFullYear()}`;

  detalhes.textContent = `Agendamento confirmado para ${diaSemana}, ${dataFormatada}, das ${
    disponibilidade[diaSemana.toLowerCase()].inicio
  } às ${disponibilidade[diaSemana.toLowerCase()].fim}.`;

  const linkCalendar = document.getElementById("link-google-calendar");
  if (linkCalendar) {
    linkCalendar.href = criarLinkGoogleCalendar(
      dataSelecionada,
      disponibilidade[diaSemana.toLowerCase()]
    );
  } else {
    console.error("Elemento de link do Google Calendar não encontrado");
  }
}

function criarLinkGoogleCalendar(data, horarios) {
  const inicio = new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
    ...horarios.inicio.split(":")
  );
  const fim = new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
    ...horarios.fim.split(":")
  );

  const evento = {
    text: "Agendamento",
    dates: `${inicio.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${fim
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "")}`,
    details: "Detalhes do agendamento",
  };

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    evento.text
  )}&dates=${evento.dates}&details=${encodeURIComponent(evento.details)}`;
}

window.onload = inicializarApp;
