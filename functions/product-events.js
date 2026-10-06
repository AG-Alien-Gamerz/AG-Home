function isCatalogueImport(before,after) {
    return Boolean(after?.catalogueImportedAt?.isEqual?.(after.updatedAt) && !before?.catalogueImportedAt?.isEqual?.(after.catalogueImportedAt));
}
module.exports={isCatalogueImport};
