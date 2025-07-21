import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const mockIAResponse = (pergunta) => {
  if (pergunta.toLowerCase().includes("contrato")) {
    return "Este documento trata de cláusulas contratuais (Resposta Mock).";
  }
  if (pergunta.toLowerCase().includes("relatório")) {
    return "A IA identificou que este é um relatório de performance (Resposta Mock).";
  }
  return "A IA identificou informações relevantes neste documento (Resposta Mock).";
};

const getRealIAResponse = async (text) => {
  const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
  try {
    const response = await axios.post(
      API_URL, { inputs: text }, {
        headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}` },
      }
    );
    return response.data[0]?.summary_text || "Não foi possível gerar um resumo.";
  } catch (error) {
    console.error("Erro ao chamar a API da Hugging Face:", error.response?.data);
    return "A IA externa não está disponível no momento.";
  }
};

export const createQuery = async (req, res) => {
  const { pergunta, datasetId } = req.body;
  const userId = req.userId;

  if (!pergunta || !datasetId) {
    return res.status(400).json({ message: 'Os campos "pergunta" e "datasetId" são obrigatórios.' });
  }

  try {
    const dataset = await prisma.dataset.findFirst({
      where: { id: datasetId, userId: userId },
      include: { records: { take: 1 } },
    });

    if (!dataset || dataset.records.length === 0) {
      return res.status(404).json({ message: 'Dataset não encontrado ou está vazio.' });
    }

    let resposta;

    if (process.env.HUGGINGFACE_API_TOKEN) {
      const textToSummarize = JSON.stringify(dataset.records[0].jsonData);
      resposta = await getRealIAResponse(textToSummarize);
    } else {
      resposta = mockIAResponse(pergunta);
    }

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