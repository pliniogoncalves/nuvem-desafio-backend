import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const searchRecords = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'O parâmetro "query" é obrigatório.' });
  }

  try {
    const records = await prisma.$queryRaw`
      SELECT 
        r.id, 
        r.dados_json AS "jsonData", -- A CORREÇÃO ESTÁ AQUI
        r.criado_em AS "createdAt", 
        r.dataset_id AS "datasetId" 
      FROM "records" AS r
      INNER JOIN "datasets" AS d ON r.dataset_id = d.id
      WHERE d.usuario_id = ${req.userId} AND r.dados_json::text ILIKE ${`%${query}%`}
    `;
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar a busca.' });
  }
};