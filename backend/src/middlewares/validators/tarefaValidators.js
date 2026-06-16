import { body, validationResult } from "express-validator";

export const validateCreate = [
  body("titulo")
    .exists({ checkNull: true })
    .withMessage("O campo 'titulo' é obrigatório")
    .isString()
    .withMessage("'titulo' deve ser uma string")
    .notEmpty()
    .withMessage("'titulo' não pode ser vazio"),
  body("descricao").optional().isString().withMessage("'descricao' deve ser uma string")
];

export const validateUpdate = [
  body("titulo").optional().isString().withMessage("'titulo' deve ser uma string"),
  body("concluida").optional().isBoolean().withMessage("'concluida' deve ser boolean")
];

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
