import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const mockIAResponse = (pergunta) => {
  if (pergunta.toLowerCase().includes("contrato")) {
    return "Este documento trata de cláusulas contratuais.";
  }
  if (pergunta.toLowerCase().includes("relatório")) {
    return "A IA identificou que este é um relatório de performance.";
  }
  return "A IA identificou informações relevantes neste documento.";
};

export const createQuery = async (req, res) => {
  const { pergunta, datasetId } = req.body;
  const userId = req.userId;

  if (!pergunta || !datasetId) {
    return res.status(400).json({ message: 'Os campos "pergunta" e "datasetId" são obrigatórios.' });
  }

  try {
    const dataset = await prisma.dataset.findFirst({
      where: { id: datasetId, userId: userId }
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset não encontrado ou não pertence a este usuário.' });
    }

    const resposta = mockIAResponse(pergunta);

    const newQuery = await prisma.query.create({
      data: {
        question: pergunta,
        answer: resposta,
        userId
      }
    });

    res.status(201).json(newQuery);
  } catch (error) {
    console.error("Erro ao criar query:", error); 
    res.status(500).json({ message: 'Erro ao criar a query.' });
  }
};

export const getMyQueries = async (req, res) => {
  try {
    const queries = await prisma.query.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar as queries.' });
  }
};