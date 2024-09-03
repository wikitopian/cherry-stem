-- PREPARE: getDoc
SELECT
	dox.mdwn
	FROM pgs
	LEFT JOIN dox
	ON dox.pgId = pgs.pgId
	WHERE pgs.path = $path
	ORDER BY dox.stmp DESC
	LIMIT 1;
