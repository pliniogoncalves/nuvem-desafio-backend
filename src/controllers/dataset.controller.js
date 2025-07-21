import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
import PDFParser from "pdf2json";

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error('Tipo de arquivo não suportado.'), false);
};

export const upload = multer({ storage, fileFilter });

const processCsvFile = (filePath, datasetId) => {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => records.push({ datasetId, jsonData: data }))
      .on('end', async () => {
        try {
          if (records.length > 0) {
            await prisma.record.createMany({ data: records });
          }
          fs.unlinkSync(filePath);
          resolve();
        } catch (dbError) {
          reject(dbError);
        }
      })
      .on('error', (streamError) => {
        reject(streamError);
      });
  });
};

const processPdfFile = (filePath, datasetId) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);

    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", async pdfData => {
      try {
        const fullText = pdfParser.getRawTextContent();
        await prisma.record.create({
          data: {
            datasetId,
            jsonData: { text: fullText }
          }
        });
        fs.unlinkSync(filePath);
        resolve();
      } catch (dbError) {
        reject(dbError);
      }
    });

    pdfParser.loadPDF(filePath);
  });
};

export const uploadDataset = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  try {
    const dataset = await prisma.dataset.create({
      data: {
        name: req.file.originalname,
        userId: req.userId,
      },
    });

    const fileExt = path.extname(req.file.originalname).toLowerCase();

    if (fileExt === '.csv') {
      await processCsvFile(req.file.path, dataset.id);
    } else if (fileExt === '.pdf') {
      await processPdfFile(req.file.path, dataset.id);
    }

    return res.status(201).json({
      message: 'Dataset enviado e processado com sucesso!',
      dataset,
    });
  } catch (error) {
    console.error("ERRO NO UPLOAD:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({ message: 'Erro ao processar o arquivo.', error: error.message });
  }
};

export const getMyDatasets = async (req, res) => {
  try {
    const datasets = await prisma.dataset.findMany({
      where: {
        userId: req.userId, 
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    res.status(200).json(datasets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar datasets.' });
  }
};


export const getRecordsFromDataset = async (req, res) => {
  try {
    const { id } = req.params;

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: id,
        userId: req.userId,
      }
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset não encontrado ou não pertence a este usuário.' });
    }

    const records = await prisma.record.findMany({
      where: {
        datasetId: id,
      }
    });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar records.' });
  }
};