export const sendSuccess = (res, message, data) => {
    res.status(200).json({ success: true, message, data });
  };
  
  export const sendBadRequest = (res, message = 'Invalid Request', data) => {
    res.status(400).json({ success: false, message, data });
  };
  
  export const sendUnauthorized = (res, message = 'Unauthorized') => {
    res.status(401).json({ success: false, message });
  };
  
  export const sendForbidden = (res, message = 'Forbidden') => {
    res.status(403).json({ success: false, message });
  };
  
  export const sendNotFound = (res, message = 'Not Found') => {
    res.status(404).json({ success: false, message });
  };
  
  export const sendError = (res, message, data) => {
    res.status(500).json({ success: false, message, data });
  };
  
  export const sendUnreachable = (res, message, data) => {
    res.status(503).json({ success: false, message, data });
  };
  