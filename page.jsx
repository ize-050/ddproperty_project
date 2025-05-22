  const filterUsers = async (term, role) => {
    try {
      // ยิง API เพื่อตรวจสอบสถานะก่อน
      const response = await serverApi.get('/api/check-status');
      
      // ตรวจสอบว่า response status เป็น 200 หรือไม่
      if (response && response.status === 200) {
        let filtered = users;
        
        // Filter by search term
        if (term) {
          const lowerTerm = term.toLowerCase();
          filtered = filtered.filter(user => 
            user.username.toLowerCase().includes(lowerTerm) ||
            user.name.toLowerCase().includes(lowerTerm) ||
            user.email.toLowerCase().includes(lowerTerm)
          );
        }
        
        // Filter by role
        if (role) {
          filtered = filtered.filter(user => user.role === role);
        }
        
        setFilteredUsers(filtered);
      } else {
        console.error('API status check failed');
      }
    } catch (error) {
      console.error('Error checking API status:', error);
    }
  };
