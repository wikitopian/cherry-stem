-- PREPARE: getPage
SELECT
	body
FROM pages
WHERE page = @page;

-- PREPARE: setPage
INSERT INTO pages(page, body) VALUES (@page, @body)
	ON CONFLICT(page) DO UPDATE SET body = @body;
